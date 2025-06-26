
import { TabItem, Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

export function Component() {
    return (
    <>
      <div className="container mx-auto flex flex-col gap-16 p-4 sm:items-center">
        <h1 className="text-2xl font-bold">View Connections</h1>
        <Tabs aria-label="Default tabs" variant="default">
            <TabItem active title="Individual" icon={HiUserCircle}>
                This is <span className="font-medium text-gray-800 dark:text-white">Profile tab's associated content</span>.
                Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                control the content visibility and styling.
            </TabItem>
            <TabItem title="Dashboard" icon={MdDashboard}>
                This is <span className="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</span>.
                Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                control the content visibility and styling.
            </TabItem>
            <TabItem title="Settings" icon={HiAdjustments}>
                This is <span className="font-medium text-gray-800 dark:text-white">Settings tab's associated content</span>.
                Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                control the content visibility and styling.
            </TabItem>
            <TabItem title="Contacts" icon={HiClipboardList}>
                This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
                Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                control the content visibility and styling.
            </TabItem>
            <TabItem disabled title="Disabled">
                Disabled content
            </TabItem>
        </Tabs>
      </div>
     </>
    )
}
