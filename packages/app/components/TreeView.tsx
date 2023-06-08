import { Text, Pressable, View } from "dripsy";
import { FC, memo } from "react";
import {
	IBookmark,
	IFolder,
	bmShelfAction,
} from "app/store/slices/bmShelfSlice";
import { useAppDispatch } from "app/store/hooks";
import {
	addBookmarkInAppwrite,
	addFolderInAppwrite,
} from "app/apis/appwriteBookmarkApi";

interface ITreeView {
	treeData: { nodes: IFolder[]; rootLeafs: IBookmark[] }; // TODO: infer automatically
	nodeArrKey: string;
	leafArrKey: string;
}
export const TreeView: FC<ITreeView> = ({
	treeData,
	nodeArrKey,
	leafArrKey,
}) => {
	const renderTree = (tree: (typeof treeData)["nodes"]) => {
		return tree.map(node => {
			return (
				<View key={node.id}>
					<Node node={node} />
					{node[nodeArrKey] && renderTree(node[nodeArrKey])}
					{node[leafArrKey] && renderLeaf(node[leafArrKey])}
				</View>
			);
		});
	};
	const renderLeaf = (leaf: (typeof treeData)["rootLeafs"]) => {
		return leaf.map(node => <LeafNode key={node.id} node={node} />);
	};
	return (
		<View>
			{renderTree(treeData["nodes"])}
			{renderLeaf(treeData["rootLeafs"])}
		</View>
	);
};
interface INode {
	node: IFolder; // TODO: infer automatically
}
const p = 15;
const Node: FC<INode> = memo(
	({ node }) => {
		return (
			<View>
				<Text
					sx={{ borderWidth: 1, borderColor: "secondary", pl: node.level * p }}
				>
					<Text variant="label">FL </Text>
					{node.title}
					{/* {node.level} {node.id}
					<br /> {node.parentId} */}
				</Text>
				<FolderActions node={node} />
			</View>
		);
	},
	(prevProps, nextProps) => prevProps.node.title === nextProps.node.title,
);

interface ILeafNode {
	node: IBookmark; // TODO: infer automatically
}
const LeafNode: FC<ILeafNode> = memo(
	({ node }) => {
		return (
			<View key={node.id}>
				<Text sx={{ pl: (node.level + 1) * p }}>
					<Text variant="label">BM </Text>
					{node.title}
					{/* {node.level} {node.id}
				<br /> {node.parentId} */}
				</Text>
			</View>
		);
	},
	(prevProps, nextProps) => prevProps.node.title === nextProps.node.title,
);

interface IFolderActions {
	node: IFolder | null;
}
export const FolderActions: FC<IFolderActions> = ({ node }) => {
	const dispatch = useAppDispatch();
	return (
		<View
			sx={{ position: "absolute", right: 0, flexDirection: "row", gap: 10 }}
		>
			{node && (
				<Pressable
					onPress={async () => {
						const newBookmark = await addBookmarkInAppwrite(node);
						dispatch(bmShelfAction.addBookmark(newBookmark));
					}}
					sx={{ bg: "secondary" }}
				>
					<Text>Add BM</Text>
				</Pressable>
			)}
			<Pressable
				onPress={async () => {
					const newFolder = await addFolderInAppwrite(node);
					dispatch(bmShelfAction.addFolder(newFolder));
				}}
				sx={{ bg: "secondary" }}
			>
				<Text>Add FL</Text>
			</Pressable>
		</View>
	);
};
