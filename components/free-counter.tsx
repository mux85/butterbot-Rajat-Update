import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { Badge } from "@/components/ui/badge";

export const FreeCounter = ({
  isPro = false,
}: {
  isPro: boolean,
}) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const userPlan = isPro ? "ButterBot Pro Plan" : "ButterBot Lite Plan";

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2 pt-3">
          <p className="text-base text-white">
  ButterBot&nbsp;
  {isPro ? (
    <Badge variant="premium" className="uppercase text-xs py-1 ml-2 mr-1">
      Pro
    </Badge>
  ) : (
    <Badge variant="secondary" className="uppercase text-xs py-1 ml-2 mr-1">
      Lite
    </Badge>
  )}
  &nbsp;Plan
</p>


  
          </div>
          {/* Conditionally render the button */}
          {!isPro && (
            <Button onClick={proModal.onOpen} variant="premium" className="w-full">
              Upgrade
              <Zap className="w-4 h-4 ml-2 fill-white" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}