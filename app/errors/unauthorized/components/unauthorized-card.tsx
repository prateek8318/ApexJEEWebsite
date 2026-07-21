"use client";
import { ShieldBan } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Badge } from "@components/ui/badge";

const UnauthorizedCard = () => {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-2 p-10">
        <ShieldBan size={128} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Badge className="px-3 py-1" variant="destructive">
            {`Unauthorized`}
          </Badge>
          <h1 className="xs:text-3xl text-2xl font-medium sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">{`Oh No! Error 401`}</h1>
          <p className="font-medium">{`Sorry, you don’t have permission to access this page.`}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-10">
        <Button
          color="primary"
          onClick={() => router.refresh()}
          size="lg"
        >{`Refresh`}</Button>
      </CardFooter>
    </Card>
  );
};

export default UnauthorizedCard;
