import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
    IconBolt,
    IconWorld,
    IconShieldCheck,
    IconLayoutDashboard,
} from "@tabler/icons-react";

export function BentoGridFeatures() {
    return (
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
            {items.map((item, i) => (
                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    className={item.className}
                    icon={item.icon}
                />
            ))}
        </BentoGrid>
    );
}

const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-24 rounded-xl dark:bg-dot-white/20 bg-dot-black/[0.2] mask-[radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/20 bg-neutral-100 dark:bg-black"></div>
);

const items = [
    {
        title: "Lightning Fast",
        description: "Built with Preact and Vite for a tiny bundle size. Adds zero lag to your website load time.",
        header: <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-blue-50 border border-neutral-100 items-center justify-center"><IconBolt size={48} className="text-blue-500 opacity-50" /></div>,
        className: "md:col-span-2",
        icon: <IconBolt className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Universal Embed",
        description: "Works on any website—React, Vue, plain HTML, you name it.",
        header: <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-purple-50 border border-neutral-100 items-center justify-center"><IconWorld size={48} className="text-purple-500 opacity-50" /></div>,
        className: "md:col-span-1",
        icon: <IconWorld className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Secure & Private",
        description: "Your secrets stay safe. We use secure project keys and validate all data.",
        header: <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-green-50 border border-neutral-100 items-center justify-center"><IconShieldCheck size={48} className="text-green-500 opacity-50" /></div>,
        className: "md:col-span-1",
        icon: <IconShieldCheck className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Powerful Feedback Dashboard",
        description:
            "Manage all your feedback, projects, and get code snippets in one centralized dashboard.",
        header: <div className="flex flex-1 w-full h-full min-h-24 rounded-xl bg-neutral-100 border border-neutral-200 items-center justify-center"><IconLayoutDashboard size={48} className="text-neutral-500 opacity-50" /></div>,
        className: "md:col-span-2",
        icon: <IconLayoutDashboard className="h-4 w-4 text-neutral-500" />,
    },
];
