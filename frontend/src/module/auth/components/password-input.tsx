import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";

export function PasswordInput(props: ComponentProps<typeof Input>) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <Input {...props} type={visible ? "text" : "password"} className="pr-11" />
            <button
                type="button"
                aria-label={visible ? "Hide password" : "Show password"}
                className="absolute inset-y-1 right-1 flex w-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={() => setVisible((current) => !current)}
            >
                {visible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
            </button>
        </div>
    );
}
