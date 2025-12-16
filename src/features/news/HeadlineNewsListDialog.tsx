import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemText, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import type { HeadlineNewsItem } from "../../types/news";

type HeadlineNewsListDialogProps = {
  open: boolean;
  onClose: () => void;
  items: HeadlineNewsItem[];
  title: string;
};

function HeadlineNewsListDialog({ open, onClose, items, title }: HeadlineNewsListDialogProps) {
  const navigate = useNavigate();

  const handleItemClick = (newsId: string) => {
    onClose();
    navigate(`/news/${newsId}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {items.map((item, index) => (
            <ListItem key={item.news_id} disablePadding>
              <ListItemButton onClick={() => handleItemClick(item.news_id)}>
                <ListItemText
                  primary={`${index + 1}. ${item.title}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default HeadlineNewsListDialog;
