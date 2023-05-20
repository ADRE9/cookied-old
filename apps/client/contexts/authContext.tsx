import { useRouter, useSegments } from "expo-router";
import React from "react";

type TAuth = {
	signIn: () => void;
	signOut: () => void;
	user: { name: string } | null;
};

const AuthContext = React.createContext<TAuth | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
	return React.useContext(AuthContext) as TAuth;
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
	const segments = useSegments();
	const router = useRouter();

	React.useEffect(() => {
		const inAuthGroup = segments[0] === "(auth)";

		if (
			// If the user is not signed in and the initial segment is not anything in the auth group.
			!user &&
			!inAuthGroup
		) {
			// Redirect to the sign-in page.
			router.replace("/login");
		} else if (user && inAuthGroup) {
			// Redirect away from the sign-in page.
			router.replace("/");
		}
	}, [user, segments]);
}

export function Provider(props) {
	const [user, setAuth] = React.useState<null | { name: string }>(null);

	useProtectedRoute(user);

	return (
		<AuthContext.Provider
			value={{
				signIn: () => setAuth({ name: "Hello" }),
				signOut: () => setAuth(null),
				user,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}