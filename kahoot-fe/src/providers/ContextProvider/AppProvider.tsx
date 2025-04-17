/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppActionType, IChannelInfo } from "@/interfaces/appTypes";
import { APP_TYPE } from "@/stores/appStore/appAction";
import AppReducer, { AppState, initAppState } from "@/stores/appStore/appReducer";
import { MezonAppEvent, MezonWebViewEvent } from "@/types/webview";
import React, { Dispatch, createContext, useEffect, useReducer } from "react";

type AppDispatch = Dispatch<AppActionType<APP_TYPE>>;

export const AppContext = createContext<{ appState: AppState; appDispatch: AppDispatch }>({
  appState: initAppState,
  appDispatch: () => {}, // Provide a default function to avoid TypeScript errors
});

const AppProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [appState, appDispatch] = useReducer(AppReducer, initAppState);
  const [channelData, setChannelData] = React.useState<IChannelInfo | undefined>();
  const [listChannel, setListChannel] = React.useState<IChannelInfo[]>([]);
  useEffect(() => {
    window.Mezon.WebView?.postEvent("PING" as MezonWebViewEvent, { message: "PING" }, () => {});
    window.Mezon.WebView?.postEvent("GET_CHANNEL" as MezonWebViewEvent, { message: "GET_CHANNEL" }, () => {});
    window.Mezon.WebView?.postEvent("GET_CHANNELS" as MezonWebViewEvent, { message: "GET_CHANNELS" }, () => {});

    window.Mezon.WebView?.onEvent("CHANNEL_RESPONSE" as MezonAppEvent, async (_, data: any) => {
      if (!data) return;
      const channelData: IChannelInfo = {
        clanId: data.clan_id,
        channelId: data.channel_id,
      };
      setChannelData(channelData);
    });
    window.Mezon.WebView?.onEvent("CHANNELS_RESPONSE" as MezonAppEvent, async (_, data: any) => {
      if (!data) return;
      const channels: IChannelInfo[] = data?.map((item: any) => ({
        clanId: item?.clan_id,
        channelId: item?.channel_id,
        channelName: item?.channel_label,
        type: item?.type,
        isPrivateChannel: !!item?.channel_private,
      }));
      setListChannel(channels);
    });

    return () => {
      window.Mezon.WebView?.offEvent("CHANNEL_INFO" as any, () => {});
      window.Mezon.WebView?.offEvent("GET_CHANNEL" as MezonAppEvent, () => {});
    };
  }, []);

  useEffect(() => {
    if (channelData) {
      appDispatch({
        type: APP_TYPE.CHANGE_CHANNEL,
        payload: channelData
      })
    }
    if (listChannel) {
      appDispatch({
        type: APP_TYPE.CHANGE_CHANNEL_LIST,
        payload: listChannel
      })
    }
  }, [channelData, listChannel]);

  return <AppContext.Provider value={{ appState, appDispatch }}>{children}</AppContext.Provider>;
};

export default AppProvider;
