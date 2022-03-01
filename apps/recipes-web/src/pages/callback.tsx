import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { magic } from "src/lib/magic";
import { UserContext } from "src/lib/UserContext";
import { PageSpinner } from "ui";
import Head from "next/head";

const notAcceptedCallbackUrls = ["/login", "/callback"];

const Callback = () => {
  const router = useRouter();
  const { setSession } = useContext(UserContext);

  // The redirect contains a `provider` query param if the user is logging in with a social provider
  useEffect(() => {
    router.query.provider ? finishSocialLogin() : finishEmailRedirectLogin();
  }, [router.query]);

  // `getRedirectResult()` returns an object with user data from Magic and the social provider
  const finishSocialLogin = async () => {
    let result = await magic.oauth.getRedirectResult();
    authenticateWithServer(result.magic.idToken);
  };

  // `loginWithCredential()` returns a didToken for the user logging in
  const finishEmailRedirectLogin = () => {
    if (router.query.magic_credential)
      magic.auth
        .loginWithCredential()
        .then((didToken) => authenticateWithServer(didToken));
  };

  // Send token to server to validate
  const authenticateWithServer = async (didToken) => {
    let res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + didToken,
      },
    });

    if (res.status === 200) {
      // Set the UserContext to the now logged in user
      let userMetadata = await magic.user.getMetadata();
      setSession({ user: userMetadata, isLoading: false });

      const callbackResult = await fetch("/api/callback");
      const callbackData = await callbackResult.json();
      if (
        callbackData.callbackUrl &&
        !notAcceptedCallbackUrls.includes(callbackData.callbackUrl)
      ) {
        router.push(callbackData.callbackUrl);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Recipes Login Callback" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PageSpinner />
      </main>
    </>
  );
};

export default Callback;
