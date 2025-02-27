import "../styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import { Provider as JotaiProvider } from "jotai";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Toaster } from "react-hot-toast";
import { __supabase } from "@/supabase";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Navbar = dynamic(() => import("@/components/Navbar.new"), { ssr: false });

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const queryClient = new QueryClient();

	return (
		<>
			<Head>
				<title>Wicket - A web3 social media platform</title>

				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta charSet="utf-8" />

				<link rel="icon" href="/newlogo.svg" />

				<link rel="manifest" href="/manifest.json" />
			</Head>

			<SessionContextProvider supabaseClient={__supabase} initialSession={pageProps.initialSession}>
				<JotaiProvider>
					<QueryClientProvider client={queryClient}>
						<>
							<Navbar />

							<main className="flex justify-center bg-base-100 select-none overflow-x-hidden">
								<section className="w-full max-w-6xl px-5 lg:px-0 min-h-screen">
									<AnimatePresence mode="wait">
										<Component {...pageProps} key={router.pathname} />
									</AnimatePresence>
								</section>
							</main>
						</>
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</JotaiProvider>
			</SessionContextProvider>

			<Toaster
				position="bottom"
				toastOptions={{
					style: {
						padding: "5px",
						gap: "8px",
					},
				}}
			/>
		</>
	);
}

export default MyApp;
