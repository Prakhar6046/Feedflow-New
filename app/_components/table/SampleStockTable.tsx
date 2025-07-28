'use client';
import { Farm } from '@/app/_typeModels/Farm';
import { SampleStock } from '@/app/_typeModels/sample';
import { selectRole } from '@/lib/features/user/userSlice';
import { useAppSelector } from '@/lib/hooks';
import { Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
interface TableHeadCell {
  id: string;
  label: string;
}

interface Props {
  tableData: TableHeadCell[];
  farms?: Farm[];
  sampleStock: SampleStock[];
}
export default function SampleStockTable({ tableData, sampleStock }: Props) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const role = useAppSelector(selectRole);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    // setOpenTransferModal(true);
    // setSelectedProduction(farm);
  };
  // const handleEdit = () => {
  //   if (selectedFeed) {
  //     router.push(`/dashboard/feedSupply/${selectedFeed.id}`);
  //     dispatch(feedAction.editFeed(selectedFeed));
  //   }
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  function EnhancedTableHead({}: {
    order?: 'asc' | 'desc';
    orderBy?: string;
    onRequestSort?: (
      event: React.MouseEvent<HTMLButtonElement>,
      property: string,
    ) => void;
  }) {
    return (
      <TableHead className="prod-action">
        <TableRow>
          {tableData.map((headCell: TableHeadCell, idx: number) => (
            <TableCell
              key={headCell.id}
              // align="center"
              sx={{
                borderBottom: 0,
                color: '#67737F',
                background: '#F5F6F8',
                fontSize: {
                  md: 16,
                  xs: 14,
                },
                fontWeight: 600,
                paddingLeft: {
                  lg: idx === 0 ? 10 : 0,
                  md: idx === 0 ? 7 : 0,
                  xs: idx === 0 ? 4 : 0,
                },
              }}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  useEffect(() => {
    router.refresh();
  }, [router]);
  return (
    <>
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '14px',
          boxShadow: '0px 0px 16px 5px #0000001A',
          textAlign: 'center',
          mt: 4,
        }}
      >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                textAlign: 'center',
              }}
            >
              <TableRow></TableRow>
            </TableHead>
            <EnhancedTableHead

            // onRequestSort={handleRequestSort}
            />
            <TableBody>
              {sampleStock && sampleStock?.length > 0 ? (
                sampleStock.map((sample: SampleStock, i: number) => {
                  return (
                    <TableRow
                      key={i}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: '#F5F6F8',

                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          paddingLeft: {
                            lg: 10,
                            md: 7,
                            xs: 4,
                          },
                          textWrap: 'nowrap',
                        }}
                        component="th"
                        scope="row"
                      >
                        {sample?.farm.name ?? ''}
                      </TableCell>
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {sample.productionUnit.name ?? ''}
                      </TableCell>
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {sample.biomass ?? ''}
                      </TableCell>
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {sample.fishCount ?? ''}
                        {/* {farm.meanWeight ? `${farm.meanWeight}g` : ""} */}
                      </TableCell>{' '}
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {Number(sample.meanWeight).toFixed(2) ?? ''}
                      </TableCell>
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {Number(sample.meanLength).toFixed(2) ?? ''}
                      </TableCell>
                      {role !== 'MEMBER' && (
                        <TableCell
                          sx={{
                            borderBottomColor: '#F5F6F8',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                          }}
                          className="cursor-pointer"
                          // onClick={() => handleEdit(user)}
                        >
                          <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            className="table-edit-option"
                            onClick={(e) => handleClick(e)}
                            sx={{
                              background: 'transparent',
                              color: 'red',
                              boxShadow: 'none',
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fill="currentColor"
                                d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
                              />
                            </svg>
                          </Button>
                          <Menu
                            id="basic-menu"
                            className="table-edit-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              'aria-labelledby': 'basic-button',
                            }}
                          >
                            <MenuItem>
                              <Stack
                                display="flex"
                                gap={1.2}
                                alignItems="center"
                                direction="row"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="1em"
                                  height="1em"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                                  />
                                </svg>

                                <Typography variant="subtitle2">
                                  Edit
                                </Typography>
                              </Stack>
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
