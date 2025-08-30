
interface ErrorProps {
  message?: string;
}

const Error = ({ message = "Something went wrong" }: ErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-red-500 text-2xl font-bold">Error</div>
      <div className="text-gray-600 mt-2">{message}</div>
    </div>
  );
};

export default Error;
