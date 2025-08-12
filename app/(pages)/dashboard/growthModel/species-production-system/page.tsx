'use client';

import { useEffect, useState } from 'react';
import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import SpeciesTable from '@/app/_components/table/SpeciesTable';
import ProductionSystemTable from '@/app/_components/table/ProductionSystemTable';
import { Box, Stack, Tab } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SpeciesProductionSystemPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const initialTab = (searchParams.get('tab') as 'species' | 'production') || 'species';
    const [selectedTab, setSelectedTab] = useState<'species' | 'production'>(initialTab);
    useEffect(() => {
        const newTab = (searchParams.get('tab') as 'species' | 'production') || 'species';
        setSelectedTab(newTab);
    }, [searchParams]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('tab', newValue);
        router.push(`${pathname}?${newSearchParams.toString()}`);
    };

    return (
        <>
            <BasicBreadcrumbs
                heading={'Species & Production System'}
                links={[
                    { name: 'Dashboard', link: '/dashboard' },
                    { name: 'Growth Models', link: '/dashboard/growthModel' },
                    { name: 'Species & Production System', link: '/dashboard/growthModel/species-production-system' },
                ]}
                buttonName={selectedTab === 'species' ? 'Add Species' : 'Add Production System'}
                buttonRoute={
                    selectedTab === 'species'
                        ? '/dashboard/growthModel/species-production-system/addSpecies'
                        : '/dashboard/growthModel/species-production-system/addProductionSystem'
                }
                permissions={true}
            />

            <TabContext value={selectedTab}>
                <Stack
                    rowGap={2}
                    columnGap={5}
                    mb={2}
                    justifyContent={'space-between'}
                    sx={{
                        flexDirection: { md: 'row', xs: 'column' },
                        alignItems: { md: 'center', xs: 'start' },
                    }}
                >
                    <Box>
                        <TabList
                            onChange={handleTabChange}
                            aria-label="Species & Production System Tabs"
                            className="production-tabs"
                        >
                            <Tab label="Species" value="species" />
                            <Tab label="Production System" value="production" />
                        </TabList>
                    </Box>
                </Stack>

                {selectedTab === 'species' ? (
                    <Box>
                        <SpeciesTable />
                    </Box>
                ) : (
                    <Box>
                        <ProductionSystemTable />
                    </Box>
                )}
            </TabContext>
        </>
    );
}