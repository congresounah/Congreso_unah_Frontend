export default function InputFields({ inputRefs, handleInputChange }: {
    inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  }) {
    return (
      <div className="flex mt-4 justify-between items-center w-full">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            onChange={(e) => handleInputChange(e, index)}
            className="w-10 h-10 text-center text-white bg-transparent border border-[#ab9a9a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ab9a9a]"
          />
        ))}
      </div>
    );
  }