import { useColorMode } from "@kobalte/core";
import { Laptop, Moon, Sun } from "lucide-solid";
import { Show } from "solid-js";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";

export default function ModeToggle() {
  const { setColorMode, colorMode } = useColorMode();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button<"button">}
        variant="ghost"
        size="sm"
        class="relative w-9 px-0"
        aria-label="Theme"
      >
        <Show when={colorMode() === "light"}>
          <Sun class="size-5" />
        </Show>
        <Show when={colorMode() === "dark"}>
          <Moon class="size-5" />
        </Show>
        <Show when={colorMode() === "system"}>
          <Laptop class="size-5" />
        </Show>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setColorMode("light")}>
          <Sun class="mr-2 size-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("dark")}>
          <Moon class="mr-2 size-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("system")}>
          <Laptop class="mr-2 size-4" />
          <span>Auto</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
