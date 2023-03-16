const Container = ({ children }: { children: any }) => {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      {children}
    </main>
  );
};

export default Container;
