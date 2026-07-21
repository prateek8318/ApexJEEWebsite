import { Card, CardContent } from "@components/ui/card";
import { myConsentStats } from "@data/my-consent";

const MyConsentStatCards = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {myConsentStats?.map((stat) => {
        const Icon = stat?.icon;
        return (
          <Card
            key={stat?.label}
            className="rounded-2xl border border-border bg-background shadow-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat?.label}</p>
                  <h3 className={`text-2xl font-bold tracking-tight ${stat?.valueClass}`}>
                    {stat.value}
                  </h3>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat?.iconClass}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MyConsentStatCards;
