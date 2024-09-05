import {
	OperationVariables as OpVars,
	QueryHookOptions as QOpts,
	QueryResult as QResult,
	QueryFunctionOptions
} from "@apollo/client";
import _defaults from "lodash/defaultsDeep";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useEventListener } from "usehooks-ts";

export type TableColumn<T> = {
	id: T;
	label: string;
	align: "left" | "center" | "justify" | "inherit" | "right";
	sortable?: boolean;
	sortKey?: string;
	reverseSortOrder?: boolean;
	width?: number | string;
	minWidth?: number | string;
};

export type TableState = {
	sort?: { column: string; direction: "asc" | "desc" };
	pagination: { offset: number; take: number };
	filters?: { [key: string]: any };
	persistState: boolean;
} & Record<string, unknown>;

export const DefaultTableConfig: TableState = {
	pagination: { offset: 0, take: 25 },
	persistState: false,
	filters: {}
};

export const defineColumns = <T>(p: readonly TableColumn<T>[]) => p as TableColumn<T>[];

function groupColumns<K extends TableColumn<CT>[], CT extends string = ColumnNamesUnion<K>>(
	columns: K
): Record<CT, TableColumn<CT>>;
function groupColumns<
	K extends TableColumn<CT>[],
	V extends keyof TableColumn<CT>,
	CT extends string = ColumnNamesUnion<K>
>(columns: K, property: V): Record<CT, TableColumn<CT>[V]>;
function groupColumns<K extends TableColumn<CT>[], CT extends string = ColumnNamesUnion<K>>(
	columns: K,
	property?: keyof TableColumn<CT>
) {
	return columns.reduce(
		(memo, x) => ({ ...memo, [x.id]: property ? x[property] : x }),
		{} as Record<CT, TableColumn<CT> | keyof TableColumn<CT>>
	);
}

/**
 * Query<T> is how the GraphQL response should be structured.
 * @param {number} total The number of rows in the table without pagination.
 * @param rows The actual query data.
 */
type Query<T> = { count: number; rows: T[] };

/**
 * RowType<A> infers the type of the row data returned by the query hook
 */
type RowType<A extends Query<unknown>> = A extends Query<infer T> ? T : never;
export type ColumnNamesUnion<A extends Array<TableColumn<any>>> = A extends Array<TableColumn<infer T>> ? T : never;

export const useTable = <
	TData extends Query<T>,
	K extends TableColumn<CT>[],
	TVars extends OpVars,
	T extends any = RowType<TData>,
	CT extends string = ColumnNamesUnion<K>
>({
	queryHook,
	columns,
	queryOptions,
	persistState,
	...tableConfig
}: Partial<TableState> & {
	queryHook: (options: QOpts<TData, TVars>) => QResult<TData, TVars>;
	columns: K;
	queryOptions?: QueryFunctionOptions;
}) => {
	const router = useRouter();
	const uniqueId = router.asPath;

	const [lastUpdated, setLastUpdated] = useState<null | Date>(null);
	const defaultState = _defaults({}, DefaultTableConfig, tableConfig);
	const [tableState, setTableState] = useTableStateStorage(uniqueId, defaultState);

	const {
		data,
		previousData,
		loading: isLoading,
		fetchMore,
		refetch
	} = queryHook({ notifyOnNetworkStatusChange: true, ...queryOptions, variables: tableState } as any);

	useEffect(() => {
		setLastUpdated(!isLoading ? new Date() : null);
	}, [isLoading]);

	const count = data?.count || previousData?.count || 0;
	const rows = useMemo(() => data?.rows || previousData?.rows || [], [data?.rows, previousData?.rows]);

	const columnMap = useMemo(() => groupColumns(columns as TableColumn<CT>[]), [columns]);
	const columnAlignMap = useMemo(() => groupColumns(columns as TableColumn<CT>[], "align"), [columns]);
	const reset = useCallback(() => setTableState(() => ({ ...defaultState })), [defaultState, setTableState]);

	const setPage = useCallback(
		(newPage: number) => {
			if (newPage < 0 || newPage > Math.ceil(count / tableState.pagination.take)) {
				return;
			}
			setTableState(({ pagination, ...state }) => ({
				...state,
				pagination: { ...pagination, offset: newPage * pagination.take }
			}));
		},
		[count, setTableState, tableState.pagination.take]
	);

	const setSort = useCallback(
		(column: string) => {
			if (column !== "") {
				const col = columns.find(col => col.sortKey === column);
				if (column && column !== tableState.sort?.column) {
					setTableState(({ sort, ...state }) => ({
						...state,
						sort: { column, direction: col?.reverseSortOrder === true ? "desc" : "asc" }
					}));
					return;
				}
				if (col?.reverseSortOrder !== true) {
					switch (tableState.sort?.direction) {
						case "asc":
							setTableState(({ sort, ...state }) => ({ ...state, sort: { column, direction: "desc" } }));
							break;
						case "desc":
						default:
							setTableState(({ sort, ...state }) => ({ ...state, sort: undefined }));
					}
					return;
				}
				switch (tableState.sort?.direction) {
					case "desc":
						setTableState(({ sort, ...state }) => ({ ...state, sort: { column, direction: "asc" } }));
						break;
					case "asc":
					default:
						setTableState(({ sort, ...state }) => ({ ...state, sort: undefined }));
				}
			}
		},
		[setTableState, tableState, columns]
	);

	const setPersistState = useCallback(
		(persistState: boolean) => {
			setTableState(({ persistState: _ps, ...state }) => ({ ...state, persistState }));
		},
		[setTableState]
	);

	const setFilters = useCallback(
		(filters: { [key: string]: any }) => {
			setTableState(({ filters: oldFilters, pagination, ...state }) => ({
				...state,
				pagination: { ...pagination, offset: 0 },
				filters
			}));
		},
		[setTableState]
	);

	const setFilter = useCallback(
		(key: string, value?: any) => {
			setTableState(({ filters: { [key]: old, ...filters } = {}, pagination, ...state }) => ({
				...state,
				pagination: { ...pagination, offset: 0 },
				filters: { ...filters, ...(value !== undefined ? { [key]: value } : {}) }
			}));
		},
		[setTableState]
	);

	const setQueryVariable = useCallback(
		(key: string, value: any) => {
			setTableState(({ pagination, ...state }) => ({
				...state,
				pagination: { ...pagination, offset: 0 },
				[key]: value
			}));
		},
		[setTableState]
	);

	const setQueryVariables = useCallback(
		(queryVariables: { [key: string]: any }) => {
			setTableState(({ pagination, ...state }) => ({
				...state,
				pagination: { ...pagination, offset: 0 },
				...queryVariables
			}));
		},
		[setTableState]
	);

	const getDownloadKey = useCallback(() => {
		const { pagination, persistState, sort, ...state } = tableState;
		state.queryHookName = queryHook.name;
		// return base64 string of the table filters
		return window.btoa(encodeURIComponent(JSON.stringify(state)));
	}, [tableState, queryHook]);

	useEffect(() => {
		refetch();
		return;
	}, [refetch, tableState]);

	return useMemo(() => {
		const {
			pagination: { take },
			sort,
			filters,
			persistState,
			...state
		} = tableState;
		const queryVariables = {
			...state,
			filters,
			setFilters,
			setFilter,
			setQueryVariables,
			setQueryVariable
		};
		return {
			rows,
			totalRowCount: count,

			refreshData: refetch,
			fetchMore: async (offset: number) =>
				offset < count ? fetchMore({ variables: { pagination: { offset, take } } }) : undefined,
			isLoading,

			toolbar: {
				lastUpdated,
				refreshData: refetch,
				getDownloadKey,
				setPersistState,
				persistState,
				hasFilters: Object.values(filters || {}).reduce((tot, curr) => tot + (curr ? 1 : 0), 0) > 0,
				reset
			},

			queryVariables: queryVariables as typeof queryVariables &
				Record<string, string | number | Date | Object | Array<any> | undefined>,

			// table head convenience
			head: {
				sort,
				onSort: setSort,
				columns,
				columnMap,
				align: columnAlignMap
			}
		};
	}, [
		tableState,
		setFilters,
		setFilter,
		setQueryVariables,
		setQueryVariable,
		rows,
		count,
		refetch,
		fetchMore,
		isLoading,
		lastUpdated,
		getDownloadKey,
		setPersistState,
		reset,
		setSort,
		columns,
		columnMap,
		columnAlignMap
	]);
};

declare global {
	interface WindowEventMap {
		"local-storage": CustomEvent;
	}
}
declare type SetValue<T> = Dispatch<SetStateAction<T>>;

export default function useTableStateStorage(
	key: string,
	initialState: TableState
): [TableState, SetValue<TableState>] {
	const readValue = useCallback(() => {
		if (typeof window === "undefined") {
			return initialState;
		}
		try {
			const item = window.localStorage.getItem(key);
			const ret = item ? parseJSON(item) : initialState;
			if (!ret.persistState) {
				window.localStorage.removeItem(key);
			}
			return ret;
		} catch (error) {
			console.warn(`Error reading localStorage key “${key}”:`, error);
			return initialState;
		}
	}, [initialState, key]);

	const [storedValue, setStoredValue] = useState(initialState);
	const setValue = (value: any) => {
		if (typeof window === "undefined") {
			return;
		}
		try {
			const newValue: TableState = value instanceof Function ? value(storedValue) : value;
			if (newValue.persistState !== false) {
				window.localStorage.setItem(key, JSON.stringify(newValue));
			} else {
				window.localStorage.removeItem(key);
			}
			setStoredValue(newValue);
			if (newValue.persistState !== false) {
				window.dispatchEvent(new Event("local-storage"));
			}
		} catch (error) {
			console.warn(`Localstorage error “${key}”:`, error);
		}
	};

	useEffect(() => {
		setStoredValue(readValue());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);

	const handleStorageChange = useCallback(
		(event: any) => {
			if ((event === null || event === void 0 ? void 0 : event.key) && event.key !== key) {
				return;
			}
			setStoredValue(readValue());
		},
		[key, readValue]
	);
	useEventListener("storage", handleStorageChange);
	useEventListener("local-storage", handleStorageChange);
	return [storedValue, setValue];
}
function parseJSON(value?: string) {
	try {
		return value === "undefined" ? undefined : JSON.parse(value !== null && value !== void 0 ? value : "");
	} catch (_a) {
		console.log("parsing error on", { value });
		return undefined;
	}
}
