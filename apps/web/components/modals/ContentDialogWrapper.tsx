import MetadataModal from "@/components/modals/Metadata";
import ContentDeleteModal from "@/components/modals/ContentDelete";
import type { ContentDialogBaseProps } from "@/types/dashboard/content";
import { ContentActions } from "@/types/common";
import DatasetDownloadModal from "@/components/modals/DatasetDownload";
import ContentMoveToFolderModal from "@/components/modals/MoveToFolder";

interface ContentDialogProps extends Omit<ContentDialogBaseProps, "open"> {
  action: ContentActions;
  onContentDelete?: () => void;
  onContentDownload?: () => void;
  onMoveToFolder?: () => void;
}

export default function ContentDialogWrapper(props: ContentDialogProps) {
  const commonModalProps = {
    content: props.content,
    open: !!props.content,
    onClose: props.onClose,
    type: props.type,
  };

  return (
    <>
      {props.action === ContentActions.EDIT_METADATA && (
        <MetadataModal {...commonModalProps} />
      )}
      {props.action === ContentActions.DELETE && (
        <ContentDeleteModal
          onDelete={props.onContentDelete}
          {...commonModalProps}
        />
      )}
      {props.action === ContentActions.MOVE_TO_FOLDER && (
        <ContentMoveToFolderModal
          onContentMove={props.onMoveToFolder}
          {...commonModalProps}
        />
      )}
      {props.action === ContentActions.DOWNLOAD && (
        <DatasetDownloadModal
          {...commonModalProps}
          dataset={props.content}
          onDownload={props.onContentDownload}
        />
      )}
    </>
  );
}
