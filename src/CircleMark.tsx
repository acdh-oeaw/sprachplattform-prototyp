import { LatLngExpression } from 'leaflet';
import { determineSize, drawCircleDiagram } from './service/MapCompute';
import { Circle, Popup, useMap, Marker } from 'react-leaflet';

import { evaluatedAnswer, question } from './types';
import { evaluateQuestion } from './service/EvaluateData';
import CircleMarkDiagram from './CircleMarkDiagram';
import { useEffect, useState } from 'react';

type CircleMarkProps = {
  dataList: question;
  showPropCircles: boolean;
};

// Create function with prop dataList of type any
// Use map hook to get map
// Iterate over dataList.features and create a Circle for each given feature on the map
export default function CircleMark({
  dataList,
  showPropCircles,
}: CircleMarkProps) {
  const [evaluatedData, setEvaluatedData] = useState<
    Array<evaluatedAnswer> | undefined
  >(undefined);
  // TODO Leverage this to adapt the size based on zoom level
  const map = useMap();
  const baseSize = 1300;
  useEffect(() => {
    const evalData = evaluateQuestion(dataList);
    setEvaluatedData(evalData);
  }, []);
  // Show the proportional circles based on the evaluated data
  if (showPropCircles) {
    return (
      <>{evaluatedData ? <CircleMarkDiagram data={evaluatedData} /> : <></>}</>
    );
  }
  return (
    <>
      {dataList.features.map((feat: any, idx: any) => {
        if (
          feat.geometry.coordinates &&
          feat.geometry.coordinates.length === 2
        ) {
          const position: LatLngExpression = [
            feat.geometry.coordinates[0],
            feat.geometry.coordinates[1],
          ];
          return (
            <Circle
              key={`marker-${idx}`}
              center={position}
              radius={
                baseSize *
                determineSize(
                  feat.properties.length,
                  [0, 1, 2, 4, 6, 8, 10], // Adapt the current brackets to the current data
                  baseSize
                )
              }
            >
              <Popup>
                <span>
                  {feat.location}, {feat.PLZ}, Belege: {feat.properties.length}{' '}
                </span>
              </Popup>
            </Circle>
          );
        }
      })}
    </>
  );
}
/*


*/
