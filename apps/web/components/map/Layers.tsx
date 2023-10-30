import React, { useEffect, useCallback } from "react";
import { Source, Layer as MapLayer } from "react-map-gl";
import type { XYZ_Layer } from "@/types/map/layer";
import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import { and_operator, or_operator } from "@/lib/utils/filtering/filtering_cql";
import type { LayerProps } from "react-map-gl";
import { v4 } from "uuid";

interface LayersProps {
  layers: XYZ_Layer[];
  addLayer: (newLayer) => void;
  projectId: string;
  filters: string[];
}

const Layers = (props: LayersProps) => {
  const sampleLayerID = "user_data.84ca9acb3f30491d82ce938334164496";
  const { layers, addLayer, filters } = props;

  const layerUrl = `${process.env.NEXT_PUBLIC_GEOAPI_URL}/collections/${sampleLayerID}/tiles/{z}/{x}/{y}`;

  const availableFilters = filters.filter(
    (filterQuery) => filterQuery !== "{}",
  );

  const { logicalOperator } = useSelector((state: IStore) => state.mapFilters);

  const getQuery = useCallback(() => {
    if (availableFilters.length) {
      if (availableFilters.length === 1) {
        return availableFilters[0];
      } else {
        if (logicalOperator === "match_all_expressions") {
          return and_operator(availableFilters);
        } else {
          return or_operator(availableFilters);
        }
      }
    }
  }, [availableFilters, logicalOperator]);

  const filterJson = getQuery();

  function modifyLayer() {
    const filterJson = getQuery();
    if (filterJson) {
      const filteredLayerSource = `${layerUrl}?filter=${encodeURIComponent(
        filterJson,
      )}`;
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
          sourceUrl: layerUrl,
          color: "#FF0000",
        },
      ]);
    }

    if (!availableFilters.length) {
      addLayer([
        {
          id: "layer1",
          sourceUrl: layerUrl,
          color: "#FF0000",
        },
      ]);
    }
  }

  useEffect(() => {
    modifyLayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterJson]);

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
