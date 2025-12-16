import { useState } from 'react';
import { Grid } from '@mui/material';
import HeadlineNewsCard from './HeadlineNewsCard';
import HeadlineNewsListDialog from './HeadlineNewsListDialog';
import type { HeadlineNewsCluster } from '../../types/news';

type HeadlineNewsGridProps = {
  clusters: HeadlineNewsCluster[];
};

function HeadlineNewsGrid({ clusters }: HeadlineNewsGridProps) {
  const [selectedCluster, setSelectedCluster] = useState<HeadlineNewsCluster | null>(null);

  const handleCardClick = (cluster: HeadlineNewsCluster) => {
    setSelectedCluster(cluster);
  };

  const handleCloseDialog = () => {
    setSelectedCluster(null);
  };

  return (
    <>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {clusters.map((cluster) => (
          <Grid key={cluster.id} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <HeadlineNewsCard
              cluster={cluster}
              onClick={() => handleCardClick(cluster)}
            />
          </Grid>
        ))}
      </Grid>

      {selectedCluster && (
        <HeadlineNewsListDialog
          open={true}
          onClose={handleCloseDialog}
          items={selectedCluster.items}
          title={selectedCluster.representative.title}
        />
      )}
    </>
  );
}

export default HeadlineNewsGrid;
