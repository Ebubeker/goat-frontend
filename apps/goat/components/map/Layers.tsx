import React, { useCallback, useEffect } from "react";
import { Source, Layer as MapLayer } from "react-map-gl";
import type { XYZ_Layer } from "@/types/map/layer";
import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import { FILTERING } from "@/lib/api/apiConstants";
import { and_operator, or_operator } from "@/lib/utils/filtering_cql";
import type { LayerProps } from "react-map-gl";
import { v4 } from "uuid";
import { GET_NON_FILTERED_LAYER } from "@/lib/api/apiConstants";

interface LayersProps {
  layers: XYZ_Layer[];
  addLayer: (newLayer) => void;
}

const Layers = (props: LayersProps) => {
  const sampleLayerID = "user_data.8c4ad0c86a2d4e60b42ad6fb8760a76e";

  const { filters, logicalOperator } = useSelector(
    (state: IStore) => state.mapFilters,
  );

  const { layers, addLayer } = props;

  const getQuery = useCallback(() => {
    if (Object.keys(filters).length) {
      if (Object.keys(filters).length === 1) {
        return filters[Object.keys(filters)[0]];
      } else {
        if (logicalOperator === "match_all_expressions") {
          return and_operator(Object.keys(filters).map((key) => filters[key]));
        } else {
          return or_operator(Object.keys(filters).map((key) => filters[key]));
        }
      }
    }
  }, [filters, logicalOperator]);

  const clusterLayer: LayerProps = {
    id: "clusters",
    type: "circle",
    source: "composite",
    "source-layer": "default",
    paint: {
      "circle-color": "#51bbd6",
      "circle-radius": 5,
    },
  };

  useEffect(() => {
    const filterJson = getQuery();
    if (filterJson) {
      const filteredLayerSource = `${FILTERING(
        sampleLayerID,
      )}?filter=${encodeURIComponent(filterJson)}`;
      addLayer([
        {
          id: "layer1",
          sourceUrl: filteredLayerSource,
          color: "#FF0000",
        },
      ]);
    } else if (filterJson === "") {
      addLayer([
        {
          id: "layer1",
          sourceUrl: FILTERING(sampleLayerID),
          color: "#FF0000",
        },
      ]);
    }

    if (!Object.keys(filters).length) {
      addLayer([
        {
          id: "layer1",
          sourceUrl: GET_NON_FILTERED_LAYER(sampleLayerID),
          color: "#FF0000",
        },
      ]);
    }
  }, [addLayer, filters, getQuery, logicalOperator, sampleLayerID]);

  return (
    <>
      {layers.length
        ? layers.map((layer: XYZ_Layer) => (
            <Source key={v4()} type="vector" tiles={[layer.sourceUrl]}>
              <MapLayer {...clusterLayer} />
            </Source>
          ))
        : null}
    </>
  );
};

export default Layers;
