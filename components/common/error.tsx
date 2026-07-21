"use client";
import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";

type ErrorProps = {
  error: Error;
  reset?: () => void;
};

const Error = ({ error, reset }: ErrorProps) => {
  const router = useRouter();

  return (
    <main className="flex h-full min-h-screen w-full items-center justify-center">
      <Card className="w-full max-w-7xl p-4 m-5">
        <CardHeader className="w-full text-center text-2xl font-bold text-muted-foreground">
          There was a problem!
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-5">
          <h3 className="text-center text-xl font-semibold text-primary break-all">
            {error?.message || `Something went wrong!`}
          </h3>
          <p className="text-center text-base font-medium text-muted-foreground">
            Please try again later or contact support if the problem persists!
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-5">
          <Button
            className="w-32"
            onClick={() => router.back()}
            size="lg"
            type="button"
            variant="ghost"
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            className="w-32"
            onClick={reset}
            size="lg"
            type="button"
            variant="default"
          >
            Try Again
            <RefreshCw />
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Error;
