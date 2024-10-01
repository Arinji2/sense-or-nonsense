"use client";

import React, { useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DashboardGraphPoints,
  ReferencePoints,
} from "../../../validations/generic/types";

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string | number;
  fields: {
    label: string;
    suffix?: string;
  }[];
  labelDisplay: string;
};

// Custom tooltip component
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  fields,
  labelDisplay,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-sm bg-black p-2">
        <p className="text-xs text-white/50">
          {labelDisplay}: <span className="inline text-blue-500">{label}</span>
        </p>
        {fields.map((field, index) => (
          <p className="text-xs text-white/50" key={index}>
            {field.label}:{" "}
            <span className="inline text-blue-500">{`${payload[index].value}${field.suffix ?? ""}`}</span>
          </p>
        ))}
      </div>
    );
  }

  return null;
};

function GraphWrapper({ children, title }: { children: any; title: string }) {
  return (
    <div className="flex h-[400px] w-full flex-col items-start justify-start gap-6 xl:h-full">
      <h2 className="text-sm font-bold tracking-title text-white/50 md:text-base">
        {title}
      </h2>
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex items-center justify-center overflow-visible">
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoundsVsDateGraph({
  data,
  maxNumberOfGamesPlayed,
}: {
  data: DashboardGraphPoints[];
  maxNumberOfGamesPlayed: ReferencePoints;
}) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const title = useMemo(() => {
    if (isMobile) {
      return "GAMES PLAYED (5 DAYS)";
    }
    return "GAMES PLAYED (7 DAYS)";
  }, [isMobile]);

  const formattedData = useMemo(() => {
    if (isMobile) {
      return data.slice(0, 5);
    }
    return data;
  }, [data, isMobile]);

  return (
    <GraphWrapper title={title}>
      <LineChart
        data={formattedData}
        margin={{
          top: -20,
          right: 0,
          left: isMobile ? 15 : 20,
          bottom: 20,
        }}
      >
        <CartesianGrid stroke="rgba(255, 255, 255, 0.2)" strokeWidth={2} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: 10, fontSize: "0.75rem" }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#22c55e"
          name="Games Played"
          strokeWidth={3}
        />
        <XAxis dataKey="x" className="text-xs">
          <Label
            value="Date"
            offset={-12}
            position="insideBottom"
            fill="white"
          />
        </XAxis>
        <YAxis className="text-xs">
          <Label
            value="Games"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle", fill: "white" }}
            offset={-10}
          />
        </YAxis>
        <Tooltip
          content={
            <CustomTooltip
              labelDisplay="DATE"
              fields={[
                {
                  label: "GAMES PLAYED",
                },
              ]}
            />
          }
        />
        <ReferenceLine
          y={maxNumberOfGamesPlayed.value}
          label={{
            value: `Max Games: ${maxNumberOfGamesPlayed.value}`,
            position: "insideBottomRight",
            style: { fill: "#d946ef", fontSize: "0.625rem" },
            dy: 20,
          }}
          stroke="#d946ef"
          strokeDasharray="3 3"
        />
      </LineChart>
    </GraphWrapper>
  );
}

export function AccuracyVsDifficulty({
  data,
  maxAccuracy,
}: {
  data: DashboardGraphPoints[];
  maxAccuracy: ReferencePoints;
}) {
  return (
    <GraphWrapper title={"ACCURACY VS DIFFICULTY"}>
      <LineChart
        data={data}
        margin={{
          top: -20,
          right: 0,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid stroke="rgba(255, 255, 255, 0.2)" strokeWidth={2} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: 10, fontSize: "0.75rem" }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#22c55e"
          name="Accuracy"
          strokeWidth={3}
        />
        <XAxis dataKey="x" className="text-xs">
          <Label
            value="Difficulty"
            offset={-12}
            position="insideBottom"
            fill="white"
          />
        </XAxis>
        <YAxis className="text-xs">
          <Label
            value="Accuracy"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle", fill: "white" }}
            offset={-10}
          />
        </YAxis>
        <Tooltip
          content={
            <CustomTooltip
              labelDisplay="DATE"
              fields={[
                {
                  label: "ACCURACY",
                },
              ]}
            />
          }
        />
        <ReferenceLine
          y={maxAccuracy.value}
          label={{
            value: `Max Accuracy: ${maxAccuracy.value}`,
            position: "insideBottomRight",
            style: { fill: "#d946ef", fontSize: "0.625rem" },
            dy: 20,
          }}
          stroke="#d946ef"
          strokeDasharray="3 3"
        />
      </LineChart>
    </GraphWrapper>
  );
}

export function MaxTimeVsDifficulty({
  data,
  maxTimeTaken,
}: {
  data: DashboardGraphPoints[];
  maxTimeTaken: ReferencePoints;
}) {
  return (
    <GraphWrapper title={"MAX TIME TAKEN VS DIFFICULTY"}>
      <LineChart
        data={data}
        margin={{
          top: -20,
          right: 0,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid stroke="rgba(255, 255, 255, 0.2)" strokeWidth={2} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: 10, fontSize: "0.75rem" }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#22c55e"
          name="Accuracy"
          strokeWidth={3}
        />
        <XAxis dataKey="x" className="text-xs">
          <Label
            value="Difficulty"
            offset={-12}
            position="insideBottom"
            fill="white"
          />
        </XAxis>
        <YAxis className="text-xs">
          <Label
            value="Max Time Taken"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle", fill: "white" }}
            offset={-10}
          />
        </YAxis>
        <Tooltip
          content={
            <CustomTooltip
              labelDisplay="DATE"
              fields={[
                {
                  label: "ACCURACY",
                },
              ]}
            />
          }
        />
        <ReferenceLine
          y={maxTimeTaken.value}
          label={{
            value: `Max Time Taken: ${maxTimeTaken.value}`,
            position: "insideBottomRight",
            style: { fill: "#d946ef", fontSize: "0.625rem" },
            dy: 20,
          }}
          stroke="#d946ef"
          strokeDasharray="3 3"
        />
      </LineChart>
    </GraphWrapper>
  );
}
