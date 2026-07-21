import Loader from "@components/common/loader";

const LoadingPage = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-around gap-5 p-5">
      <Loader />
    </main>
  );
};

export default LoadingPage;
