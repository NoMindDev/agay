import { Badge } from "./ui/badge";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <Badge variant={"default"} className="font-normal">
        Supabase environment variables required
      </Badge>
    </div>
  );
}
