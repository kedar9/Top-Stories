import React from 'react';
import ReactDOM from 'react-dom';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType as ElemType } from 'office-ui-fabric-react/lib/Shimmer';

function LoadingShimmer() {
  const customElementsGroup = (
    <div style={{ display: 'flex' }} className="loading-shimmer">
      <ShimmerElementsGroup
        shimmerElements={[
          { type: ElemType.line, width: 96, height: 96 },
          { type: ElemType.gap, width: 24, height: 96 }
        ]}
      />
      <ShimmerElementsGroup
        flexWrap={true}
        shimmerElements={[
          { type: ElemType.line, width: 720, height: 24 },
          { type: ElemType.line, width: 480, height: 24 },
          { type: ElemType.gap, width: 240, height: 48 }
        ]}
      />
    </div>
  );
  return (
    <Shimmer customElementsGroup={customElementsGroup} width={720} />
  );
}

export default LoadingShimmer;
