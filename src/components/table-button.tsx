import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function TableButton({ slug }: { slug: string }) {
  const router = useRouter();
  return (
    <Button
      className="cursor-pointer"
      size="sm"
      onClick={() => router.push(`/projects/${slug}`)}
    >
      Vezi
    </Button>
  );
}
