"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const initialColumns = ["Name", "Age", "Email"];

const data = [
  { Name: "Alice", Age: 25, Email: "alice@example.com" },
  { Name: "Bob", Age: 30, Email: "bob@example.com" },
  { Name: "Charlie", Age: 35, Email: "charlie@example.com" },
];

function SortableHeader({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    backgroundColor: "#f5f5f5",
  };

  return (
    <th ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </th>
  );
}

export default function DnDKitTableColumn() {
  const [columns, setColumns] = useState(initialColumns);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = columns.indexOf(active.id);
      const newIndex = columns.indexOf(over.id);
      setColumns(arrayMove(columns, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <table
        border={1}
        cellPadding={10}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <SortableContext
            items={columns}
            strategy={horizontalListSortingStrategy}
          >
            <tr>
              {columns.map((col) => (
                <SortableHeader key={col} id={col} />
              ))}
            </tr>
          </SortableContext>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </DndContext>
  );
}
