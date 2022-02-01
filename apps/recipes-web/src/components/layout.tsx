import { ReactElement, useCallback, useEffect, useMemo } from "react";
import Meta from "@components/meta";
import Navbar from "./Navbar";
import cn from "classnames";
import { PageSpinner } from "ui";
import { useLoadingContext } from "src/lib/LoadingContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface LayoutProps {
  useContainer?: boolean;
  children: ReactElement | ReactElement[];
}

const Layout = ({ children, useContainer = true }: LayoutProps) => {
  const { data: session } = useSession();
  const { loading } = useLoadingContext();
  const { handleSetLoading } = useLoadingContext();
  const { events } = useRouter();

  const isUser: boolean = useMemo(() => !!session?.user, [session]);

  const removeLoader = useCallback(() => {
    handleSetLoading(false);
  }, [handleSetLoading]);

  useEffect(
    () => events.on("routeChangeComplete", removeLoader),
    [events, removeLoader]
  );

  return (
    <>
      <Meta />
      <div className="flex flex-col min-h-screen">
        {isUser && <Navbar />}
        {loading && <PageSpinner />}
        <main className={cn({ "container flex-grow": useContainer })}>
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Layout;
