import { CreateFileMutation, useCreateFileMutation } from "@gql/requests/generated";
import { v4 as uuid } from "@lukeed/uuid";
import { S3 } from "aws-sdk";
import { useSnackbar } from "notistack";
import { useState } from "react";

import { getApolloClient } from "@/utils/apolloClient.browser";

const useFileUpload = () => {
	const { enqueueSnackbar } = useSnackbar();
	const client = getApolloClient();
	const [isLoading, setLoading] = useState(false);
	const [createFile] = useCreateFileMutation();

	const upload = async (file: File) => {
		const filename = uuid();
		setLoading(true);

		const { url, fields }: S3.PresignedPost = await fetch(`/api/file/upload/${filename}`).then(data => data.json());

		if (!url || !fields) {
			setLoading(false);
			enqueueSnackbar("Upload failed, please try again.", { variant: "error" });
			return undefined;
		}

		const body = new FormData();

		// Ensure the file is the last key
		[...Object.entries({ ...fields }), ["file", file] as [string, File]].forEach(([key, value]) => {
			body.append(key, value);
		});

		return fetch(url, { method: "POST", body })
			.then(res =>
				createFile({
					variables: {
						input: {
							size: file.size,
							title: file.name,
							key: filename,
							type: file.type
						}
					}
				})
			)
			.then(response => {
				const savedFile = response.data?.file;
				if (!savedFile) {
					enqueueSnackbar("Upload failed, please try again.", { variant: "error" });
					return undefined;
				}
				enqueueSnackbar(`File '${response.data?.file.title}' uploaded successfully.`, { variant: "success" });
				return savedFile;
			})
			.catch(e => {
				console.error(e);
				enqueueSnackbar("Upload failed, please try again.", { variant: "error" });
				return undefined;
			})
			.finally(() => setLoading(false));
	};

	const handleUpload = (callback: (value: CreateFileMutation["file"][]) => void) => async (acceptedFiles: File[]) => {
		if (isLoading || acceptedFiles.length === 0) {
			return;
		}

		return Promise.all(acceptedFiles.map(file => upload(file))).then(result => {
			const images = result?.filter(f => f !== undefined) as CreateFileMutation["file"][];
			if (images?.length === 0) {
				return [];
			}
			return callback(images);
		});
	};

	return {
		isLoading,
		upload,
		handleUpload
	};
};

export default useFileUpload;
