import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { ChangeEvent, useEffect, useState } from "react";
import { Attendee } from "../models/Attendee";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const app = axios.create({
  baseURL: "https://nlw-unite.onrender.com",
});

export function AttendeeList() {

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(" ");

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [attendeesLength, setLength] = useState(0);

  const totalPages = Math.ceil(attendeesLength / 5);

  const onSearchInputChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    const url = new URL(window.location.toString());
    setSearch(event.target.value.trim());
    url.searchParams.set("name", event.target.value.trim());
  };

  const goToPage = (newPage: number) => {
    const url = new URL(window.location.toString());
    url.searchParams.set("page", String(newPage));
    setPage(newPage);
  };

  const gotToNextPage = () => {
    goToPage(page + 1);
  };

  const goToLastPage = () => {
    goToPage(totalPages);
  };

  const gotToPreviewPage = () => {
    if (page > 1) {
      goToPage(page - 1);
    }
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const getAttendees = async () => {
    const url = new URL(window.location.toString());
    url.searchParams.set("page", String(page));
    url.searchParams.set("name", search);
    const Page = parseInt(`${url.searchParams.get("page") != null ? url.searchParams.get("page") : "1"}`);
    const Name = `${url.searchParams.get("name") != null ? url.searchParams.get("name") : " "}`
    const urlRequest = `/attendee/all/1/${Page - 1}/${Name}`;

    console.log(urlRequest);
    
    const result = await app.get(urlRequest).then((Result) => Result.data);
    setAttendees(result.attendees);
    setLength(result.length);
  };

  useEffect(() => {
    getAttendees();
  }, [page, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes:</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={onSearchInputChanged}
            className="bg-transparent focus:ring-0 flex-1 outline-none border-0 p-0 text-sm"
            type="text"
            placeholder="Buscar participante:"
            value={search}
          />
        </div>
      </div>
      <Table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 40 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 border border-white/10 rounded"
              />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data de check-in</TableHeader>
            <TableHeader></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <tr
                className="border-b border-white/10 hover:bg-white/10"
                key={attendee.id}
              >
                <TableCell style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 border border-white/10 rounded cursor-pointer"
                    name=""
                    id=""
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt == undefined
                    ? "Não fez checkin ainda"
                    : dayjs().to(attendee.checkedInAt)}
                </TableCell>
                <TableCell style={{ width: 8 }}>
                  <IconButton transparent>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {attendeesLength}
            </TableCell>
            <TableCell style={{ textAlign: "right" }} colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  pagina {page} de {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={page == 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={gotToPreviewPage} disabled={page == 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={gotToNextPage}
                    disabled={page == totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToLastPage}
                    disabled={page == totalPages}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
