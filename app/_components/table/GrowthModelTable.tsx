'use client';
import { breadcrumsAction } from '@/lib/features/breadcrum/breadcrumSlice';
import { useAppDispatch } from '@/lib/hooks';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { selectRole } from '@/lib/features/user/userSlice';
import { useAppSelector } from '@/lib/hooks';
import { getLocalItem } from '@/app/_lib/utils';
import Loader from '../Loader';
import { EnhancedTableHeadProps } from '../UserTable';
import { productionSystem } from '../GrowthModel';
import { Species } from '../feedSupply/NewFeedLibarary';
import { getCookie } from 'cookies-next';
import { clientSecureFetch } from '@/app/_lib/clientSecureFetch';

interface GrowthModel {
  id: number;
  organisationId: number;
  isDefault: boolean;
  modelId: number;
  createdAt: string;
  updatedAt: string;
  models: {
    id: number;
    name: string;
    specieId: string;
    productionSystemId: string;
    adcCp: number;
    adcCf: number;
    adcNfe: number;
    geCp: number;
    geCf: number;
    geNfe: number;
    wasteFactor: number;
    temperatureCoefficient: string;
    tgcA: number;
    tgcB: number;
    tgcC: number;
    tgcD?: number;
    tgcE?: number;
    tFCRModel: string;
    tFCRa: number;
    tFCRb: number;
    tFCRc: number;
    de:number;
    createdAt: string;
    updatedAt: string;
  };
  organisation?: {
    name: string;
  };
}

import { UserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canEditGrowthModel, canViewGrowthModel, canDeleteGrowthModel } from '@/app/_lib/utils/permissions/access';

interface Props {
  tableData: {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
  }[];
  growthModels?: GrowthModel[];
  permisions: boolean;
  userAccess?: UserAccessConfig;
  userRole?: string;
}

export default function GrowthModelTable({
  tableData,
  growthModels,
  permisions,
  userAccess,
  userRole,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const pathName = usePathname();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selectedGrowthModel, setSelectedGrowthModel] = useState<GrowthModel>();
  const role = useAppSelector(selectRole);
  const [sortedGrowthModels, setSortedGrowthModels] = useState<GrowthModel[]>();
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const featuredSpecies = speciesList?.filter((sp) => sp.isFeatured);
  const [productionSystemList, setProductionSystemList] = useState<productionSystem[]>([]);
  const featuredProductionSystemList = productionSystemList?.filter((sp) => sp.isFeatured);
  const token = getCookie('auth-token');
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<{
    direction: 'asc' | 'desc';
    column: string;
  }>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pathName) {
      setSortDataFromLocal(getLocalItem(pathName));
    }
  }, [pathName]);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    model: GrowthModel,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedGrowthModel(model);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (selectedGrowthModel) {
      router.push(`/dashboard/growthModel/${selectedGrowthModel.id}`);
    }
    handleClose();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speciesRes, productionRes] = await Promise.all([
          clientSecureFetch('/api/species', {
            method: 'GET',
          }),
          clientSecureFetch('/api/production-system', {
            method: 'GET',
          }),
        ]);


        if (!speciesRes.ok) throw new Error('Failed to fetch species');
        if (!productionRes.ok) throw new Error('Failed to fetch production system');

        const speciesData = await speciesRes.json();
        const productionData = await productionRes.json();

        setSpeciesList(speciesData);
        setProductionSystemList(productionData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async () => {
    if (selectedGrowthModel) {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/growth-model?id=${selectedGrowthModel.models.id}`,
          {
            method: 'DELETE',
          },
        );

        if (response.ok) {
          toast.success('Growth model deleted successfully');
          router.refresh();
        } else {
          toast.error('Failed to delete growth model');

          console.error('Failed to delete growth model');
        }
      } catch (error) {
        console.error('Error deleting growth model:', error);
      } finally {
        setLoading(false);
      }
    }
    handleClose();
  };

  function EnhancedTableHead(data: EnhancedTableHeadProps) {
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        handleRequestSort(event, property);
      };
    return (
      <TableHead>
        <TableRow>
          {tableData.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : undefined}
              sx={{
                backgroundColor: '#F5F6F8',
                color: '#555555',
                fontWeight: 600,
                fontSize: '14px',
                borderBottomColor: '#F5F6F8',
                borderBottomWidth: 2,
                textWrap: 'nowrap',
                paddingLeft: {
                  lg: 10,
                  md: 7,
                  xs: 4,
                },
              }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                sx={{
                  '&.MuiTableSortLabel-active': {
                    color: '#555555',
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: '#555555',
                  },
                }}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const handleRequestSort = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    if (growthModels) {
      const sortedData = [...growthModels].sort(
        (model1: GrowthModel, model2: GrowthModel) => {
          const orderType = order === 'asc' ? 1 : -1;
          if (property === 'name') {
            if (model1.models.name < model2.models.name) return -1 * orderType;
            if (model1.models.name > model2.models.name) return 1 * orderType;
            return 0;
          } else if (property === 'specie') {
            const specie1 =
              featuredSpecies.find((s) => s.id === model1.models.specieId)?.name ||
              '';
            const specie2 =
              featuredSpecies.find((s) => s.id === model2.models.specieId)?.name ||
              '';
            if (specie1 < specie2) return -1 * orderType;
            if (specie1 > specie2) return 1 * orderType;
            return 0;
          } else if (property === 'productionSystem') {
            const system1 =
              featuredProductionSystemList.find(
                (p) => p.id === model1.models.productionSystemId,
              )?.name || '';
            const system2 =
              featuredProductionSystemList.find(
                (p) => p.id === model2.models.productionSystemId,
              )?.name || '';
            if (system1 < system2) return -1 * orderType;
            if (system1 > system2) return 1 * orderType;
            return 0;
          } else if (property === 'createdAt') {
            if (model1.createdAt < model2.createdAt) return -1 * orderType;
            if (model1.createdAt > model2.createdAt) return 1 * orderType;
            return 0;
          }
          return 0;
        },
      );
      setSortedGrowthModels(sortedData);
    }
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (sortDataFromLocal) {
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);
      if (growthModels) {
        const sortedData = [...growthModels].sort(
          (model1: GrowthModel, model2: GrowthModel) => {
            const orderType = data.direction === 'asc' ? -1 : 1;
            if (data.column === 'name') {
              if (model1.models.name < model2.models.name)
                return -1 * orderType;
              if (model1.models.name > model2.models.name) return 1 * orderType;
              return 0;
            } else if (data.column === 'specie') {
              const specie1 =
                featuredSpecies.find((s) => s.id === model1.models.specieId)
                  ?.name || '';
              const specie2 =
                featuredSpecies.find((s) => s.id === model2.models.specieId)
                  ?.name || '';
              if (specie1 < specie2) return -1 * orderType;
              if (specie1 > specie2) return 1 * orderType;
              return 0;
            } else if (data.column === 'productionSystem') {
              const system1 =
                featuredProductionSystemList.find(
                  (p) => p.id === model1.models.productionSystemId,
                )?.name || '';
              const system2 =
                featuredProductionSystemList.find(
                  (p) => p.id === model2.models.productionSystemId,
                )?.name || '';
              if (system1 < system2) return -1 * orderType;
              if (system1 > system2) return 1 * orderType;
              return 0;
            } else if (data.column === 'createdAt') {
              if (model1.createdAt < model2.createdAt) return -1 * orderType;
              if (model1.createdAt > model2.createdAt) return 1 * orderType;
              return 0;
            }
            return 0;
          },
        );
        setSortedGrowthModels(sortedData);
      }
    }
  }, [sortDataFromLocal, featuredSpecies, featuredProductionSystemList]);

  useEffect(() => {
    if (growthModels && !sortDataFromLocal) {
      setSortedGrowthModels(growthModels);
    }
  }, [growthModels]);

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: '14px',
            boxShadow: '0px 0px 16px 5px #0000001A',
            mt: 4,
          }}
        >
          <TableContainer
            sx={{
              maxHeight: '72.5vh',
              overflow: 'auto',
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {sortedGrowthModels && sortedGrowthModels.length > 0 ? (
                  sortedGrowthModels.map((model: GrowthModel, i: number) => {
                   
                    const speciesName =
                      featuredSpecies.find((s) => s.id === model.models.specieId)
                        ?.name || '';
                    const productionSystemName =
                      featuredProductionSystemList.find(
                        (p) => p.id === model.models.productionSystemId,
                      )?.name || '';
                    
                    return (
                      <TableRow
                        key={i}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            borderBottomColor: '#F5F6F8',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            textWrap: 'nowrap',
                            paddingLeft: {
                              lg: 10,
                              md: 7,
                              xs: 4,
                            },
                            lineHeight: 0
                          }}
                        >
                          {model.models.name}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottomColor: '#F5F6F8',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            textWrap: 'nowrap',
                            paddingLeft: {
                              lg: 10,
                              md: 7,
                              xs: 4,
                            },
                          }}
                        >
                          {speciesName}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottomColor: '#F5F6F8',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            textWrap: 'nowrap',
                            paddingLeft: {
                              lg: 10,
                              md: 7,
                              xs: 4,
                            },
                          }}
                        >
                          <Stack display={"flex"} alignItems={"center"} gap={1} direction="row">
                            <Typography>{productionSystemName}</Typography>

                            {model.isDefault && (
                              <Tooltip
                                title={`This is the default production system for ${speciesName}`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                  <g fill="none">
                                    <g clip-path="url(#SVGwDJxaeOQ)">
                                      <path fill="#06A19B" d="M21.95 10.605a1.75 1.75 0 0 1-.5.86l-3.3 3.22a.4.4 0 0 0-.08.12a.3.3 0 0 0 0 .14l.78 4.56c.065.336.03.684-.1 1a1.65 1.65 0 0 1-.61.77a1.83 1.83 0 0 1-.92.35h-.13a1.8 1.8 0 0 1-.84-.21l-4.1-2.14a.28.28 0 0 0-.28 0l-4.1 2.15a1.9 1.9 0 0 1-1 .21a1.83 1.83 0 0 1-.93-.35a1.75 1.75 0 0 1-.61-.78a1.8 1.8 0 0 1-.1-1l.78-4.55a.23.23 0 0 0 0-.14a.4.4 0 0 0-.07-.12l-3.3-3.24a1.8 1.8 0 0 1-.49-.85a1.75 1.75 0 0 1 0-1a1.81 1.81 0 0 1 1.49-1.21l4.5-.66a.18.18 0 0 0 .12-.05a.3.3 0 0 0 .09-.11l2.1-4.18c.143-.3.369-.553.65-.73a1.79 1.79 0 0 1 2.57.74l2.08 4.16a.4.4 0 0 0 .1.12a.2.2 0 0 0 .13.05l4.57.66c.332.05.644.192.9.41c.251.217.441.496.55.81c.106.32.124.662.05.99" stroke-width="0.5" stroke="#06A19B" />
                                    </g>
                                    <defs>
                                      <clipPath id="SVGwDJxaeOQ">
                                        <path fill="#fff" d="M2 2.395h20v19.21H2z" />
                                      </clipPath>
                                    </defs>
                                  </g>
                                </svg>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottomColor: '#F5F6F8',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            textWrap: 'nowrap',
                            paddingLeft: {
                              lg: 10,
                              md: 7,
                              xs: 4,
                            },
                          }}
                        >
                          {new Date(model.createdAt).toLocaleDateString()}
                        </TableCell>
                        {(role === 'SUPERADMIN' || permisions) && (
                          <TableCell
                            sx={{
                              borderBottomColor: '#F5F6F8',
                              borderBottomWidth: 2,
                              color: '#555555',
                              fontWeight: 500,
                              textWrap: 'nowrap',
                              paddingLeft: {
                                lg: 10,
                                md: 7,
                                xs: 4,
                              },
                            }}
                          >
                            <Button
                              onClick={(event) => handleClick(event, model)}
                              sx={{
                                minWidth: 'auto',
                                p: 1,
                                borderRadius: '8px',
                                backgroundColor: '#F5F6F8',
                                color: '#555555',
                                '&:hover': {
                                  backgroundColor: '#E8E9EB',
                                },
                              }}
                            >
                              <Box
                                component="svg"
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </Box>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={tableData.length}
                      sx={{
                        textAlign: 'center',
                        color: '#555555',
                        fontWeight: 500,
                        py: 4,
                      }}
                    >
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderRadius: '12px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                minWidth: 140,
                paddingY: 1,
                overflow: 'hidden',
              },
            }}
          >
            {(canViewGrowthModel(userAccess, userRole) || userRole === 'SUPERADMIN') && (
              <MenuItem
                sx={{
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#F0F4FF',
                    svg: { color: '#1E40AF' },
                    '.edit-text': { color: '#1E40AF' },
                  },
                }}
                onClick={handleEdit}
                disabled={false}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {canEditGrowthModel(userAccess, userRole) || userRole === 'SUPERADMIN' ? (
                    <>
                      <Box
                        component="svg"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        sx={{ color: '#060606ff' }}
                      >
                        <path d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z" />
                      </Box>
                      <Typography sx={{ fontSize: '14px', color: '#080808ff' }}>
                        Edit
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Box
                        component="svg"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        sx={{ color: '#060606ff' }}
                      >
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3" />
                      </Box>
                      <Typography sx={{ fontSize: '14px', color: '#080808ff' }}>
                        View
                      </Typography>
                    </>
                  )}
                </Stack>
              </MenuItem>
            )}

            {canDeleteGrowthModel(userAccess, userRole) && (
              <>
                <Divider />
                <MenuItem
                  sx={{
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#FFF1F1',
                      svg: { color: '#D32F2F' },
                      '.delete-text': { color: '#D32F2F' },
                    },
                  }}
                  onClick={handleDelete}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      component="svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      sx={{ color: '#ff0000', fontWeight: 600 }}
                    >
                      <path d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5q0-.425.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.587 1.413T17 21zM7 6v13h10V6z" />
                    </Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#ff0000' }}>
                      Delete
                    </Typography>
                  </Stack>
                </MenuItem>
              </>
            )}
          </Menu>
        </Paper>
      )}
    </>
  );
}
