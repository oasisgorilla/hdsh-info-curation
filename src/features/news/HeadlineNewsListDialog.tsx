import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemText, IconButton, Box, Typography } from "@mui/material";
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
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          fontSize: '15px',
          fontWeight: 600,
          color: 'text.secondary',
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          pr: 6,
          position: 'relative',
          pl: 3,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '16px',
            bgcolor: 'primary.main',
            borderRadius: '2px',
          },
        }}
      >
        {title}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          px: 0,
          pt: 0,
          pb: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'grey.50',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.400',
            borderRadius: '3px',
            '&:hover': {
              bgcolor: 'grey.500',
            },
          },
        }}
      >
        {items.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              관련 뉴스가 없습니다
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {items.map((item, index) => (
              <ListItem
                key={item.news_id}
                disablePadding
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'grey.200',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <ListItemButton
                  onClick={() => handleItemClick(item.news_id)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    pl: 4.5,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      bgcolor: 'transparent',
                      transition: 'background-color 0.2s ease',
                    },
                    '&:hover': {
                      bgcolor: 'grey.50',
                      '&::before': {
                        bgcolor: 'primary.main',
                      },
                    },
                    '&:active': {
                      bgcolor: 'grey.100',
                    },
                    '&:focus-visible': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: '-2px',
                      bgcolor: 'grey.50',
                    },
                  }}
                >
                  <ListItemText
                    primary={`${index + 1}. ${item.title}`}
                    title={item.title}
                    slotProps={{
                      primary: {
                        variant: 'body2',
                        sx: {
                          fontWeight: 500,
                          color: 'text.primary',
                          lineHeight: 1.5,
                          letterSpacing: '-0.01em',
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default HeadlineNewsListDialog;
