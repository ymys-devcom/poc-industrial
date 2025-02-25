
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { Provider } from "@supabase/supabase-js";

const Auth = () => {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const handleOAuthSignIn = async (provider: Provider) => {
    try {
      setIsLoading(prev => ({ ...prev, [provider]: true }));
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Robotics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="grid gap-4">
          <Button
            variant="outline"
            disabled={isLoading.google}
            onClick={() => handleOAuthSignIn("google")}
            className="w-full"
          >
            {isLoading.google ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>

          <Button
            variant="outline"
            disabled={isLoading.azure}
            onClick={() => handleOAuthSignIn("azure")}
            className="w-full"
          >
            {isLoading.azure ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.microsoft className="mr-2 h-4 w-4" />
            )}
            Continue with Microsoft
          </Button>

          <Button
            variant="outline"
            disabled={isLoading.facebook}
            onClick={() => handleOAuthSignIn("facebook")}
            className="w-full"
          >
            {isLoading.facebook ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.facebook className="mr-2 h-4 w-4" />
            )}
            Continue with Facebook
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
