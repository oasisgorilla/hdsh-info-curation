import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import HeadlineNewsCard from "./HeadlineNewsCard";
import HeadlineNewsListDialog from "./HeadlineNewsListDialog";
import type { HeadlineNewsCluster } from "../../types/news";

type HeadlineNewsGridProps = {
  clusters: HeadlineNewsCluster[];
};

function HeadlineNewsGrid({ clusters }: HeadlineNewsGridProps) {
  const navigate = useNavigate();
  const [selectedCluster, setSelectedCluster] =
    useState<HeadlineNewsCluster | null>(null);

  // 카드 클릭 시: 대표 뉴스 상세 페이지로 이동
  const handleCardClick = (cluster: HeadlineNewsCluster) => {
    navigate(`/news/${cluster.representative.news_id}`);
  };

  // 칩 클릭 시: 클러스터 뉴스 목록 다이얼로그 표시
  const handleChipClick = (cluster: HeadlineNewsCluster) => {
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
              chipClickHandler={handleChipClick}
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
