import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { formatCoins, formatSigned } from "@/shared/lib/format";
import { QueryState } from "@/shared/components/QueryState";
import { playApi } from "@/features/games/api";

const GAME_COLORS = {
  wheel: "secondary",
  raffle: "primary",
  leaderboard: "success",
  slot: "warning",
} as const;

export default function HistoryPage() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["history", page, limit],
    queryFn: () => playApi.history(page + 1, limit),
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Play history
      </Typography>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!!data && data.total === 0}
        emptyText="You haven't played anything yet."
      />
      {data && data.total > 0 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Game</TableCell>
                  <TableCell>Outcome</TableCell>
                  <TableCell align="right">Bet</TableCell>
                  <TableCell align="right">Result</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="right">When</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((h) => (
                  <TableRow key={h.id} hover>
                    <TableCell>
                      <Chip
                        size="small"
                        label={h.gameType}
                        color={GAME_COLORS[h.gameType]}
                        variant="outlined"
                      />{" "}
                      {h.gameName}
                    </TableCell>
                    <TableCell>{h.outcome}</TableCell>
                    <TableCell align="right">{formatCoins(h.bet)}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        color: h.amountWon > 0 ? "success.main" : h.amountWon < 0 ? "error.main" : "text.secondary",
                      }}
                    >
                      {formatSigned(h.amountWon)}
                    </TableCell>
                    <TableCell align="right">{formatCoins(h.balanceAfter)}</TableCell>
                    <TableCell align="right">
                      {new Date(h.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={data.total}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>
      )}
    </Box>
  );
}
