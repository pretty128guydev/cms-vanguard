import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
const Pagination = ({table,totalPages}) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        className="ring-1 ring-neutral-800 disabled:bg-neutral-600"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        className="ring-1 ring-neutral-800 disabled:bg-neutral-600"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
