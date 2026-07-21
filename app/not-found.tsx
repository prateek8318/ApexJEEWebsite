"use client";
import { ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter } from "@components/ui/card";

const NotFound = () => {
  const router = useRouter();
  return (
    <main className="flex h-full min-h-screen w-full flex-col items-center justify-center">
      <Card className="m-5 p-5">
        <CardContent className="flex flex-col items-center justify-center gap-10">
          <ShieldX size={192} />
          <div className="flex flex-col items-center justify-center gap-2">
            <Badge variant="destructive">{`Not Found`}</Badge>
            <h1 className="text-center text-xl font-medium sm:text-3xl md:text-4xl">{`Oh No! Error 404`}</h1>
            <p className="text-center text-sm font-medium text-muted-foreground sm:text-base">{`Sorry, the page you are looking for doesn’t exist or has been removed.`}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-10">
          <Button
            color="primary"
            onClick={router.back}
            size="lg"
            type="button"
            variant="default"
          >{`Back`}</Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default NotFound;
