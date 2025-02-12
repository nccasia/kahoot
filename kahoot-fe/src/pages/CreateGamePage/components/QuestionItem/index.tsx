import Collapse from "@/components/Collapse";
import Input from "@/components/Input";

const QuestionContent = () => {
  return (
    <div className='body p-4 font-diablo text-white'>
      <div className='flex items-center flex-wrap'>
        <span className='inline-block min-w-[200px] text-start text-2xl'>Câu hỏi:</span>
        <Input className='flex-1 rounded-lg' />
      </div>
      <div className='flex flex-col gap-3 mt-2 pt-2 border-t-2 border-gray-100'>
        <div className='flex items-center flex-wrap gap-1'>
          <span className='inline-block min-w-[200px] text-start text-2xl'>Đáp án 1:</span>
          <div className='input-box flex-1 min-w-[300px] relative'>
            <div className='absolute left-0 top-1/2 -translate-y-1/2 flex w-[40px] rounded-lg h-full bg-[#1C0C8E] items-center justify-center'>
              <input type='radio' className='w-5 p-3' />
            </div>
            <Input className='rounded-lg w-full pl-11' />
          </div>
        </div>
        <div className='flex items-center flex-wrap gap-1'>
          <span className='inline-block min-w-[200px] text-start text-2xl'>Đáp án 2:</span>
          <div className='input-box flex-1 min-w-[300px] relative'>
            <div className='absolute left-0 top-1/2 -translate-y-1/2 flex w-[40px] rounded-lg h-full bg-[#1C0C8E] items-center justify-center'>
              <input type='radio' className='w-5 p-3' />
            </div>
            <Input className='rounded-lg w-full pl-11' />
          </div>
        </div>
        <div className='flex items-center flex-wrap gap-1'>
          <span className='inline-block min-w-[200px] text-start text-2xl'>Đáp án 3:</span>
          <div className='input-box flex-1 min-w-[300px] relative'>
            <div className='absolute left-0 top-1/2 -translate-y-1/2 flex w-[40px] rounded-lg h-full bg-[#1C0C8E] items-center justify-center'>
              <input type='radio' className='w-5 p-3' />
            </div>
            <Input className='rounded-lg w-full pl-11' />
          </div>
        </div>
        <div className='flex items-center flex-wrap gap-1'>
          <span className='inline-block min-w-[200px] text-start text-2xl'>Đáp án 4:</span>
          <div className='input-box flex-1 min-w-[300px] relative'>
            <div className='absolute left-0 top-1/2 -translate-y-1/2 flex w-[40px] rounded-lg h-full bg-[#1C0C8E] items-center justify-center'>
              <input type='radio' className='w-5 p-3' />
            </div>
            <Input className='rounded-lg w-full pl-11' />
          </div>
        </div>
      </div>
    </div>
  );
};
const QuestionItem = () => {
  return (
    <div className=''>
      <Collapse content={<QuestionContent />}>
        <div className='font-diablo text-start line-clamp-2'>
          <span className='mr-2'>Câu 1:</span>
          <span>
            Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn
            đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở đâu? Bạn đang ở
            đâu? Bạn đang ở đâu?
          </span>
        </div>
      </Collapse>
    </div>
  );
};
export default QuestionItem;
