import { getServerSession } from "@lib/getServerSession";
import { consentRecords } from "@data/consent-records";
import { myConsentRecords } from "@data/my-consent";
import {
  columns,
  ConsentRecordsTable,
  MyConsentStatCards,
  MyConsentTable,
  myConsentColumns,
} from "./components";

const ConsentArtifactPage = async () => {
  const session = await getServerSession();
  const isAdmin = session?.role?.includes("ROLE_ORG_ADMIN");

  if (isAdmin) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col gap-8 h-full min-h-[calc(100vh-96px)]">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Consent Artifact
          </h1>
          <p className="text-muted-foreground/50 font-medium">
            Manage all consent records across your organization
          </p>
        </div>
        <ConsentRecordsTable columns={columns} data={consentRecords} />
      </div>
    );
  }
  if (session?.role?.includes("ROLE_END_USER")) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col gap-8 h-full min-h-[calc(100vh-96px)]">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Consent
          </h1>
          <p className="text-muted-foreground/50 font-medium">
            Track and manage your personal consents
          </p>
        </div>
        <MyConsentStatCards />
        <MyConsentTable columns={myConsentColumns} data={myConsentRecords} />
      </div>
    );
  }
  return (
    <section className="flex h-full min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-2 p-5">
      <h1 className="text-center text-xl font-medium text-secondary">
        You do not have access to this page.
        <br /> Please contact your administrator for assistance.
      </h1>
    </section>
  );
};

export default ConsentArtifactPage;
