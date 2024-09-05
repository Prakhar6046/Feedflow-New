import { useParametersQuery } from "@gql/requests/generated";
import { ReactNode, useMemo } from "react";

import { Typography } from "@mui/material";

export default function useParameters() {
	const { data: raw, ...query } = useParametersQuery();

	let data = useMemo(() => raw?.parameters || undefined, [raw]);

	const options = useMemo<{ label: ReactNode; value: string }[]>(() => {
		return (
			data?.reduce(
				(tot, curr) => [
					...tot,
					{
						value: curr.id,
						label: (
							<>
								<Typography variant="subtitle2">{curr.name}</Typography>
								<Typography fontSize={"0.8em"} variant="body2">
									{curr.description}
								</Typography>
							</>
						)
					}
				],
				[] as { label: ReactNode; value: string }[]
			) || []
		);
	}, [data]);

	// const grouped = useMemo<{ [key: string]: typeof data } | undefined>(() => {
	// 	return data?.reduce((r, a) => {
	// 		r[a.description!] = r[a.description!] || [];
	// 		r[a.description!].push(a);
	// 		return r;
	// 	}, {} as { [key: string]: typeof data });
	// }, [data]);

	return {
		// grouped,
		data,
		options,
		query
	};
}
