import { PreferenceCenterForm } from "./components";


type Props = {
  params: Promise<{ uuid: string }>;
};

const PreferenceCenterPage = async ({ params }: Props) => {
  const { uuid } = await params;

  return (
    <div className="container mx-auto py-10 px-4 flex flex-col gap-8 min-h-[calc(100vh-96px)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Preference Center</h1>
        <p className="text-muted-foreground/50 font-medium">
          Manage consent preferences for record{" "}
          <span className="text-foreground font-semibold">{uuid}</span>
        </p>
      </div>
      <PreferenceCenterForm />
    </div>
  );
};

export default PreferenceCenterPage;
