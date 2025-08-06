import { SyntheticEvent, useState } from 'react';

export default function useTabs(defaultValues?: string) {
  const [currentTab, setCurrentTab] = useState(defaultValues || '');

  return {
    currentTab,
    onChangeTab: (event: SyntheticEvent<Element, Event>, newValue: any) => {
      setCurrentTab(newValue);
    },
    setCurrentTab,
  };
}
