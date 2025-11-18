'use client';
// import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import sendEmailIcon from '@/public/static/img/ic-send-email.svg';
import sentEmailIcon from '@/public/static/img/ic-sent-email.svg';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { deleteImage, handleUpload } from '../_lib/utils';
import {
  AddOrganizationFormInputs,
  SingleOrganisation,
} from '../_typeModels/Organization';
import { SingleUser } from '../_typeModels/User';
import MapComponent, { AddressInfo } from './farm/MapComponent';
import HatcheryForm from './hatchery/HatcheryForm';
import { getCookie } from 'cookies-next';
import { clientSecureFetch } from '../_lib/clientSecureFetch';
import {
  MODULE_DISPLAY_ORDER,
  ModuleAccessMap,
  resolveModuleAccess,
  getUserAccessConfig,
  hasFullModuleAccess,
  UserAccessConfig,
} from '../_lib/constants/userAccessMatrix';
import { canAddOrganisationOfType } from '../_lib/utils/permissions/access';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type AdvisorOption = {
  id: number | string; // Allow string for temporary IDs
  name: string;
  email: string;
  organisationName: string;
  organisationType: string;
};

const ADVISOR_ACCESS_OPTIONS = [
  { value: 3, label: 'Add, edit, view' },
  { value: 2, label: 'Edit & view' },
  { value: 1, label: 'View' },
];

export const OrganisationType = [
  'Feed flow help desk',
  'Feed manufacturer',
  'Fish Producer',
  'Third party advisors (external)',
  // 'Fish supplier',
];

export const UserTypeByOrganisation: { [key: string]: string[] } = {
  'Feed flow help desk': [
    'Business manager',
    'Feedflow Administrator (Admin)',
    'Advisor: Technical services - adviser to Clients',
  ],
  'Feed manufacturer': [
    'Business Manager',
    'Feedflow administrator',
    'Advisor: Technical services - adviser to Clients',
  ],
  'Fish Producer': [
    'Business manager',
    'Feedflow administrator',
    'Operational manager',
    'Farm manager',
    'General worker (level 2)',
    'General worker (level 1)',
  ],
  'Third party advisors (external)': [
    'Business manager',
    'Feedflow administrator',
    'Advisor: Technical services - adviser to Clients',
  ],
  // 'Fish supplier': [
  //   'Business manager',
  //   'Feedflow administrator',
  //   'Advisor: Technical services - adviser to Clients',
  // ],
};

interface Props {
  organisations: SingleOrganisation[];
  type?: string;
  loggedUser: SingleUser;
  authToken: string;
}
const AddNewOrganisation = ({ type, loggedUser }: Props) => {
  const token = getCookie('auth-token');

  const [profilePic, setProfilePic] = useState<string>();
  const router = useRouter();
  const [isHatcherySelected, setIsHatcherySelected] = useState<boolean>(false);
  const [organisationCount, setOrganisationCount] = useState<number>(0);
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [addressInformation, setAddressInformation] =
    useState<AddressInfo | null>(null);
  const [useAddress, setUseAddress] = useState<boolean>(false);
  const [altitude, setAltitude] = useState<string>('');
  const [inviteSent, setInviteSent] = useState<{ [key: number]: boolean }>({});
  const [advisorOptions, setAdvisorOptions] = useState<AdvisorOption[]>([]);
  const [advisorLoading, setAdvisorLoading] = useState<boolean>(false);

  // Get logged user's access configuration
  const loggedUserOrgType = loggedUser?.organisationType || '';
  const loggedUserType = loggedUser?.role || '';
  const loggedUserAccess: UserAccessConfig | undefined = getUserAccessConfig(
    loggedUserOrgType,
    loggedUserType,
  );

  // Map organization type display names to permission keys
  const getOrganisationPermissionKey = (orgType: string): 'feedManufacturers' | 'fishProducers' | null => {
    if (orgType === 'Feed manufacturer') return 'feedManufacturers';
    if (orgType === 'Fish Producer') return 'fishProducers';
    return null;
  };

  // Check if user can add a specific organization type
  const canAddOrganisationType = (orgType: string): boolean => {
    // SUPERADMIN has full access
    if (loggedUserType === 'SUPERADMIN') return true;
    
    if (!loggedUserAccess) return false;
    const permissionKey = getOrganisationPermissionKey(orgType);
    if (!permissionKey) return false;
    return canAddOrganisationOfType(loggedUserAccess, permissionKey, loggedUserType);
  };

  // Filter available organization types based on user permissions
  const getAvailableOrganisationTypes = (): string[] => {
    // SUPERADMIN has full access to all organization types
    if (loggedUserType === 'SUPERADMIN') {
      return OrganisationType.filter(type => type !== 'Feed flow help desk'); // Exclude Feed flow help desk as it's typically not added by users
    }
    
    if (!loggedUserAccess) return [];
    
    // Feed Flow Help Desk can add Feed Manufacturers and Fish Producers
    if (loggedUserOrgType === 'Feed flow help desk') {
      return ['Feed manufacturer', 'Fish Producer'];
    }
    
    // Feed Manufacturer can add Fish Producers
    if (loggedUserOrgType === 'Feed manufacturer') {
      return ['Fish Producer'];
    }
    
    // Fish Producer can add Fish Producers (level 2, but we'll allow it for now)
    // Actually, according to the matrix, Fish Producer Business Manager has level 2 for fishProducers
    // Level 2 means "View with limited edits", not "Add". So they shouldn't be able to add.
    // But let's check the access level:
    if (loggedUserOrgType === 'Fish Producer') {
      const fishProducerAccess = resolveModuleAccess(
        loggedUserAccess,
        'organisations',
        'fishProducers',
      );
      // Only allow if access level is 3 or higher (Add, edit, view)
      if (fishProducerAccess >= 3) {
        return ['Fish Producer'];
      }
    }
    
    // Third Party Advisors and Fish Suppliers have no add permissions
    return [];
  };

  const availableOrgTypes = getAvailableOrganisationTypes();
  // const handleInviteUser = (invite: boolean, index: number) => {
  //   if (!invite) {
  //     setInviteSent((prev) => {
  //       const newInviteState = !prev[index];
  //       setValue(`contacts.${index}.newInvite`, newInviteState);
  //       return {
  //         ...prev,
  //         [index]: newInviteState,
  //       };
  //     });
  //   }
  // };
  const {
    register,
    setValue,
    handleSubmit,
    control,
    watch,
    reset,
    trigger,
    clearErrors,
    formState: { errors, isDirty, isValid },
  } = useForm<AddOrganizationFormInputs>({
    defaultValues: {
      contacts: [
        {
          name: '',
          role: '',
          inputRole: '',
          email: '',
          phone: '',
          userType: '',
          permission: '',
          permissions: undefined,
          userDefinition: '',
          invite: false,
        },
      ],
      allocatedAdvisors: [],
    },
    mode: 'onChange',
  });
  const editableRef = useRef<HTMLParagraphElement>(null);
  const handleInviteUser = async (index: number) => {
    const contact = watch(`contacts.${index}`);
    const currentlyInvited = contact.invite;

    if (!isContactComplete(contact)) {
      toast.error('Please fill all required fields before marking for invite.');
      return;
    }

    setValue(`contacts.${index}.invite`, !currentlyInvited, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setInviteSent((prev) => ({
      ...prev,
      [index]: !currentlyInvited,
    }));

    // Force validation for the full contacts array if needed
    await trigger(`contacts`);
  };


  const isContactComplete = (contact: any) => {
    return (
      contact.name?.trim() &&
      contact.userType && // Changed from permission
      contact.role?.trim() &&
      contact.email?.trim() &&
      contact.phone?.trim()
    );
  };



  const handleOrgPrefixChange = () => {
    const prefix = editableRef.current?.innerText || 'ORG-';
    const fullCode = `${prefix}${Number(organisationCount) + 1}`;
    setValue('organisationCode', fullCode);
  };

  const onSubmit: SubmitHandler<AddOrganizationFormInputs> = async (data) => {
    console.log('data', data);
    
    // Check if user has permission to add this organization type
    if (!canAddOrganisationType(data.organisationType)) {
      toast.dismiss();
      toast.error(
        `You do not have permission to add ${data.organisationType} organizations.`,
      );
      return;
    }

    // Check for duplicate contacts
    const contactEmails = data.contacts.map(c => c.email?.toLowerCase()).filter(Boolean);
    const uniqueEmails = new Set(contactEmails);
    if (contactEmails.length !== uniqueEmails.size) {
      toast.error('Duplicate email addresses found in contacts. Please remove duplicates.');
      return;
    }

    // Check if at least one admin is present
    // Ensure at least one contact has full access (any module level 4)
    const hasHighAccess = data.contacts.some((contact) => {
      const access = getUserAccessConfig(
        data.organisationType,
        contact.userType,
      );
      return hasFullModuleAccess(access);
    });
   console.log('hasHighAccess', hasHighAccess);
    if (!hasHighAccess) {
      toast.dismiss();
      toast.error(
        'At least one contact must have full (level 4) module access for this organisation.',
      );
      return;
    }

    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);

    try {
      if (data && loggedUser) {
        data.createdBy = loggedUser.organisationId;

        // Map user types to include access level information
        const contactsWithPermissions = data.contacts.map((contact) => {
          const access = getUserAccessConfig(
            data.organisationType,
            contact.userType,
          );

          return {
            ...contact,
            permission: contact.userType,
            inputRole: contact.role, // Save the role input value as inputRole
            permissions: access?.modules ?? {},
            userDefinition: access?.definition,
          };
        });

        // Extract advisor contacts - these will be added to OrganisationAdvisor after users are created
        const advisorContacts = contactsWithPermissions.filter(
          (contact) => contact.userType === 'Advisor: Technical services - adviser to Clients'
        );

        // Get advisor assignments from allocatedAdvisors
        // Map temporary IDs to emails for matching after users are created
        const advisorAssignments = [];
        const advisorContactsInfo = [];

        for (const assignment of data.allocatedAdvisors || []) {
          if (assignment?.advisorId) {
            // Check if it's a temporary ID (from contacts being added)
            const advisorIdStr = String(assignment.advisorId);
            if (advisorIdStr.startsWith('temp-')) {
              // Find the corresponding contact by index
              const tempIndex = parseInt(advisorIdStr.replace('temp-', ''));
              const contact = advisorContacts[tempIndex];
              if (contact) {
                advisorContactsInfo.push({
                  email: contact.email,
                  accessLevel: assignment.accessLevel ?? 3,
                });
              }
            } else {
              // Regular advisor ID (shouldn't happen in AddNewOrganisation, but handle it)
              advisorAssignments.push({
                advisorId: Number(assignment.advisorId),
                accessLevel: Number(assignment.accessLevel ?? 0),
              });
            }
          }
        }

        const response = await clientSecureFetch('/api/add-organisation', {
          method: 'POST',
          body: JSON.stringify({
            ...data,
            imageUrl: profilePic,
            contacts: contactsWithPermissions,
            allocatedAdvisors: advisorAssignments,
            advisorContacts: advisorContactsInfo, // Pass advisor contacts separately
          }),
        });

        const responseData = await response.json();

        if (!response.ok || !responseData.status) {
          toast.error(responseData.error || 'Failed to add organisation');
          return;
        }

        const organisationId = responseData?.data?.organisation?.id;

        if (!organisationId) {
          toast.error('Organisation ID missing in response.');
          return;
        }

        const contactsToInvite = data.contacts.filter((c) => c.invite);

        if (contactsToInvite.length > 0) {
          const inviteRes = await clientSecureFetch('/api/invite/organisation', {
            method: 'POST',
            body: JSON.stringify({
              organisationId,
              users: contactsToInvite,
              createdBy: loggedUser.id,
            }),
          });

          const inviteData = await inviteRes.json();

          if (!inviteRes.ok) {
            toast.error(inviteData.error || 'Failed to send invites');
            return;
          }
          
          // If there's a warning (e.g., users already invited), show info instead of error
          if (inviteData.warning) {
            console.log('Invite warning:', inviteData.message);
            // Don't show error - emails were already sent during organization creation
          } else if (!inviteData.status) {
            toast.error(inviteData.error || 'Failed to send invites');
            return;
          }
        }

        toast.success(responseData.message || 'Organisation created successfully');
        router.push('/dashboard/organisation');
        // Reset form with default values to ensure clean state
        reset({
          contacts: [
            {
              name: '',
              role: '',
              email: '',
              phone: '',
              userType: '',
              permission: '',
              permissions: undefined,
              userDefinition: '',
              invite: false,
            },
          ],
          allocatedAdvisors: [],
        });
      }
    } catch (error) {
      console.error('Error creating organisation:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };


  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });
  const {
    fields: advisorFields,
    append: appendAdvisor,
    remove: removeAdvisor,
  } = useFieldArray({
    control,
    name: 'allocatedAdvisors',
  });

  const AddContactField = () => {


    if (fields.length > 0) {
      const lastContact = watch(`contacts.${fields.length - 1}`);


      if (
        lastContact &&
        lastContact.name?.trim() &&
        lastContact.role?.trim() &&
        lastContact.email?.trim() &&
        lastContact.phone?.trim() &&
        lastContact.userType // Changed from permission
      ) {

        append({
          name: '',
          role: '',
          inputRole: '',
          email: '',
          phone: '',
          userType: '',
          permission: '',
          permissions: undefined,
          userDefinition: '',
          invite: false,
        });

      } else {
        toast.dismiss();
        toast.error('Please fill all required fields in the previous contact before adding a new one.');
      }
    } else {

      append({
        name: '',
        role: '',
        email: '',
        phone: '',
        userType: '',
        permission: '',
        permissions: undefined,
        userDefinition: '',
        invite: false,
      });
    }
  };

  const AddAdvisorField = () => {
    const currentAdvisors = watch('allocatedAdvisors') ?? [];
    if (currentAdvisors.length === 0) {
      appendAdvisor({
        advisorId: null,
        accessLevel: 3,
        advisorEmail: '',
        advisorName: '',
      });
      return;
    }
    const lastAdvisor = currentAdvisors[currentAdvisors.length - 1];
    if (lastAdvisor?.advisorId && lastAdvisor?.accessLevel) {
      appendAdvisor({
        advisorId: null,
        accessLevel: 3,
        advisorEmail: '',
        advisorName: '',
      });
    } else {
      toast.dismiss();
      toast.error(
        'Please fill the previous adviser allocation before adding another.',
      );
    }
  };

  useEffect(() => {
    if (watch('organisationType') === 'Hatchery') {
      setIsHatcherySelected(true);
    } else {
      setIsHatcherySelected(false);
    }
  }, [watch('organisationType')]);
  useEffect(() => {
    if (addressInformation && useAddress) {
      setValue('address', addressInformation.address);
      setValue('city', addressInformation.city);
      setValue('postCode', addressInformation.postcode);
      setValue('province', addressInformation.state);
      setValue('country', addressInformation.country);
      clearErrors(['address', 'city', 'postCode', 'country', 'province']);
      setUseAddress(false);
    }
  }, [addressInformation, useAddress, clearErrors]);

  useEffect(() => {
    if (type === 'fishProducers') {
      // Only set if user has permission to add Fish Producer
      if (canAddOrganisationType('Fish Producer')) {
        setValue('organisationType', 'Fish Producer');
      } else {
        toast.error('You do not have permission to add Fish Producer organizations.');
      }
    }
  }, [type, loggedUserAccess]);

  useEffect(() => {
    if (organisationCount) {
      const fullCode = `ORG-${Number(organisationCount) + 1}`;
      setValue('organisationCode', fullCode);
    }
  }, [organisationCount]);

  useEffect(() => {
    const getORGCount = async () => {
      const data = await clientSecureFetch(`/api/organisation/count`, {
        method: 'GET',
        cache: 'no-store',
      });
      const res = await data.json();
      setOrganisationCount(res?.data);
    };

    getORGCount();
  }, []);

  useEffect(() => {
    const loadAdvisors = async () => {
      try {
        setAdvisorLoading(true);
        const response = await clientSecureFetch('/api/advisors', {
          method: 'GET',
          cache: 'no-store',
        });
        const result = await response.json();
        if (result?.status && Array.isArray(result.data)) {
          setAdvisorOptions(result.data);
        } else {
          setAdvisorOptions([]);
        }
      } catch (error) {
        console.error('Failed to load advisors', error);
        setAdvisorOptions([]);
      } finally {
        setAdvisorLoading(false);
      }
    };

    loadAdvisors();
  }, []);

  // Extract advisor contacts to show in dropdown
  const contacts = watch('contacts') || [];
  const advisorContacts = contacts.filter(
    (contact) => contact.userType === 'Advisor: Technical services - adviser to Clients'
  );

  // Initialize advisor options from contacts being added
  useEffect(() => {
    if (advisorContacts.length > 0) {
      const advisorOptionsFromContacts = advisorContacts.map((contact, index) => ({
        id: `temp-${index}`, // Temporary ID for contacts being added
        name: contact.name || '',
        email: contact.email || '',
        organisationName: watch('organisationName') || '',
        organisationType: watch('organisationType') || '',
      }));
      setAdvisorOptions(advisorOptionsFromContacts);
    } else {
      setAdvisorOptions([]);
    }
  }, [advisorContacts.length, watch('organisationName'), watch('organisationType')]);

  const handleAdvisorSelection = (
    index: number,
    advisorId: string | number | null,
    onChange?: (value: string | number | null) => void,
  ) => {
    const selectedAdvisor = advisorOptions.find(
      (advisor) => String(advisor.id) === String(advisorId),
    );

    if (!advisorId || !selectedAdvisor) {
      onChange?.(null);
      setValue(`allocatedAdvisors.${index}.advisorEmail`, '', {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(`allocatedAdvisors.${index}.advisorName`, '', {
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }

    const currentAssignments = watch('allocatedAdvisors') ?? [];
    if (
      currentAssignments.some(
        (assignment, assignmentIndex) =>
          assignmentIndex !== index &&
          String(assignment?.advisorId) === String(selectedAdvisor.id),
      )
    ) {
      toast.dismiss();
      toast.error('This adviser is already allocated.');
      onChange?.(null);
      return;
    }

    onChange?.(selectedAdvisor.id);
    setValue(
      `allocatedAdvisors.${index}.advisorEmail`,
      selectedAdvisor.email ?? '',
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
    setValue(
      `allocatedAdvisors.${index}.advisorName`,
      selectedAdvisor.name ?? '',
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };


  return (
    <Stack
      sx={{
        borderRadius: '14px',
        boxShadow: '0px 0px 16px 5px #0000001A',
        mt: 4,
      }}
    >
      <Box
        sx={{
          p: {
            md: 3,
            xs: 2,
          },
          fontSize: 20,
          fontWeight: 600,
          borderColor: '#0000001A',
        }}
      >
        Information
      </Box>

      <Divider />

      <Grid
        container
        sx={{
          p: {
            md: 3,
            xs: 2,
          },
        }}
      >
        <Grid
          item
          xl={3}
          md={5}
          xs={12}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: 3,
            alignItems: {
              xs: 'center',
            },
          }}
        >
          {' '}
          <Typography
            variant="h6"
            color="rgb(99, 115, 129)"
            fontSize={14}
            alignSelf={'flex-start'}
          >
            Profile Picture
          </Typography>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            style={{
              backgroundImage: `url(${profilePic})`,
              backgroundSize: '100% 100%',
            }}
            startIcon={!profilePic && <CloudUploadIcon />}
            className="upload-file-input1 "
            sx={{
              textTransform: 'unset',
              fontSize: 12,
              width: 140,
              height: 140,
              borderRadius: 100,
              border: '7px solid white',
              outline: '1px dashed rgba(145, 158, 171, 0.32)',
              backgroundColor: 'rgb(244, 246, 248)',
              boxShadow: 'none',
              color: 'rgb(99, 115, 129)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Box>{!profilePic && 'Upload Photo'}</Box>
            <VisuallyHiddenInput
              type="file"
              {...register('image', {
                onChange: (e) =>
                  handleUpload(e.target.files, profilePic, setProfilePic),
              })}
              accept=".jpg,.jpeg,.png,.svg"
            />
          </Button>
          {profilePic && (
            <Box display={'flex'} gap="10px" alignItems={'center'} mt={'2px'}>
              <Button
                component="label"
                variant="contained"
                sx={{
                  background: '#06A19B',
                  color: '#fff',
                  fontWeight: 600,
                  padding: '4px',
                  textTransform: 'capitalize',
                  borderRadius: '10px',
                  border: '1px solid #06A19B',
                  // position: "absolute",
                  // bottom: "1%",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
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
                Edit
                <VisuallyHiddenInput
                  type="file"
                  {...register('image', {
                    onChange: (e) =>
                      handleUpload(e.target.files, profilePic, setProfilePic),
                  })}
                  accept=".jpg,.jpeg,.png,.svg"
                />
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={() =>
                  deleteImage({ image: profilePic }, setProfilePic)
                }
                sx={{
                  background: '#D71818',
                  fontWeight: 600,
                  padding: '4px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '10px',
                  color: '#fff',
                  border: '1px solid #D71818',
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                }}
              >
                {' '}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.2084 2.43761H10.6302V1.38915C10.6302 0.622847 10.0073 0 9.24384 0H4.44777C3.68147 0 3.06145 0.622847 3.06145 1.38915V2.43761H0.483183C0.217046 2.43761 0 2.65466 0 2.92079C0 3.18692 0.217055 3.40397 0.483183 3.40397H1.40142L1.99595 11.6275C2.09221 12.9591 3.21145 14 4.54692 14H9.14947C10.4829 14 11.604 12.9591 11.7004 11.6275L12.295 3.40397H13.2132C13.4793 3.40397 13.6964 3.18692 13.6964 2.92079C13.6964 2.6556 13.4745 2.43761 13.2084 2.43761ZM4.02796 1.39198C4.02796 1.15982 4.2167 0.969192 4.44791 0.969192H9.24109C9.47324 0.969192 9.66104 1.15794 9.66104 1.39198V2.44044H4.0281L4.02796 1.39198ZM10.7321 11.5577C10.6717 12.3862 9.9762 13.0336 9.14479 13.0336H4.54513C3.71654 13.0336 3.0182 12.3862 2.9578 11.5577L2.36798 3.40395H11.3182L10.7321 11.5577Z"
                    fill="white"
                  />
                  <path
                    d="M5.56912 5.37891C5.30298 5.37891 5.08594 5.59596 5.08594 5.86209V10.5543C5.08594 10.8204 5.30299 11.0375 5.56912 11.0375C5.83525 11.0375 6.0523 10.8204 6.0523 10.5543V5.86209C6.0523 5.59689 5.83525 5.37891 5.56912 5.37891Z"
                    fill="white"
                  />
                  <path
                    d="M8.1199 5.37891C7.85376 5.37891 7.63672 5.59596 7.63672 5.86209V10.5543C7.63672 10.8204 7.85377 11.0375 8.1199 11.0375C8.38603 11.0375 8.60308 10.8204 8.60308 10.5543V5.86209C8.60308 5.59689 8.38792 5.37891 8.1199 5.37891Z"
                    fill="white"
                  />
                </svg>
                Delete
              </Button>
            </Box>
          )}
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'row'}
            sx={{
              width: {
                md: '90%',
                xs: '100%',
              },
            }}
          >
            <Typography
              variant="body1"
              fontSize={12}
              textAlign={'center'}
              margin="0 auto"
              color="#979797"
            >
              Allowed *.jpeg, *.jpg, *.png,*.svg <br />
              max size of 2M byte
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xl={9}
          md={7}
          xs={12}
          sx={{
            mt: {
              md: 0,
              xs: 5,
            },
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <TextField
                label="Organisation Name *"
                type="text"
                className="form-input"
                {...register('organisationName', {
                  required: true,
                  validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                  pattern: validationPattern.alphabetsNumbersAndSpacesPattern,
                  // validate: (value: string) => {
                  //   const isUnique = organisations?.every((val) => {
                  //     return val.name.toLowerCase() !== value.toLowerCase();
                  //   });
                  //   return (
                  //     isUnique ||
                  //     'Please enter a unique name. The name you entered is not available.'
                  //   );
                  // },
                })}
                focused
                sx={{
                  width: '100%',
                }}
              />
              {errors &&
                errors.organisationName &&
                errors.organisationName.type === 'required' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}
              {errors &&
                errors.organisationName &&
                errors.organisationName.type === 'pattern' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.OnlyAlphabetsandNumberMessage}
                  </Typography>
                )}
              {errors &&
                errors.organisationName &&
                errors.organisationName.type === 'validate' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {errors?.organisationName.message}
                  </Typography>
                )}
            </Box>
            <Stack
              display={'flex'}
              justifyContent={'flex-start'}
              direction={'row'}
              sx={{
                width: '100%',
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={'100%'} position={'relative'}>
                <TextField
                  label="Organisation Code *"
                  type="text"
                  className="form-input org-code"
                  {...register('organisationCode', {
                    required: true,
                    validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                    // pattern: validationPattern.alphabetsNumbersAndSpacesPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />

                <Box
                  sx={{
                    height: '1.4375em',
                    paddingInline: '14px',
                    display: 'flex',
                    gap: 0.5,
                    alignItems: 'center',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translate(0, -50%)',
                  }}
                >
                  <Typography
                    variant="body1"
                    component={'p'}
                    contentEditable
                    suppressContentEditableWarning
                    ref={editableRef}
                    onBlur={handleOrgPrefixChange}
                    onKeyUp={handleOrgPrefixChange}
                    className="editable-org-code"
                  >
                    ORG-
                  </Typography>
                  <Typography variant="body1">
                    {Number(organisationCount) + 1}
                  </Typography>
                </Box>

                {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === 'required' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Box>
            </Stack>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Organisation Type *
              </InputLabel>
              <Controller
                name={`organisationType`}
                control={control}
                rules={{ 
                  required: true,
                  validate: (value) => {
                    if (!value) return 'Organisation type is required';
                    if (!canAddOrganisationType(value)) {
                      return `You do not have permission to add ${value} organizations.`;
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Organisation Type *"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={!!type || (availableOrgTypes.length === 0 && loggedUserType !== 'SUPERADMIN')}
                  >
                    {(availableOrgTypes.length === 0 && loggedUserType !== 'SUPERADMIN') ? (
                      <MenuItem value="" disabled>
                        No organization types available. You do not have permission to add organizations.
                      </MenuItem>
                    ) : (
                      availableOrgTypes.map((organisation, i) => (
                        <MenuItem value={organisation} key={i}>
                          {organisation}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              />

              {errors && errors.organisationType && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.organisationType.message || validationMessage.required}
                </Typography>
              )}
              
              {availableOrgTypes.length === 0 && loggedUserType !== 'SUPERADMIN' && (
                <Typography variant="body2" color="orange" fontSize={13} mt={0.5}>
                  You do not have permission to add organizations. Please contact your administrator.
                </Typography>
              )}
            </FormControl>
            {isHatcherySelected && (
              <HatcheryForm
                altitude={altitude}
                register={register}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
                errors={errors}
              />
            )}
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent="space-between"
              marginTop={3}
              marginBottom={2}
            >
              <Typography
                variant="subtitle1"
                color="black"
                fontWeight={500}
                fontSize={16}
              >
                Address
              </Typography>

              <MapComponent
                setAddressInformation={setAddressInformation}
                setUseAddress={setUseAddress}
                isCalAltitude={true}
                setAltitude={setAltitude}
                token={token ?? ''}
                clearErrors={clearErrors}

              />
            </Box>
            <Stack
              display={'flex'}
              justifyContent={'flex-start'}
              direction={'row'}
              sx={{
                width: '100%',
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={'100%'}>
                <TextField
                  label="Address *"
                  type="text"
                  className="form-input"
                  {...register('address', {
                    required: true,
                    validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                    pattern: validationPattern.addressPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.address &&
                  errors.address.type === 'required' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.address &&
                  errors.address.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.AddressMessage}
                    </Typography>
                  )}
              </Box>

              <Box width={'100%'}>
                <TextField
                  label="City *"
                  type="text"
                  className="form-input"
                  {...register('city', {
                    required: true,
                    validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                    pattern:
                      validationPattern.alphabetsSpacesAndSpecialCharsPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors && errors.city && errors.city.type === 'required' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}
                {errors && errors.city && errors.city.type === 'pattern' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.alphabetswithSpecialCharacter}
                  </Typography>
                )}
              </Box>
            </Stack>
            <Stack
              display={'flex'}
              justifyContent={'flex-start'}
              direction={'row'}
              sx={{
                width: '100%',
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={'100%'}>
                <TextField
                  label="Province *"
                  type="text"
                  className="form-input"
                  {...register('province', {
                    required: true,
                    validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                    pattern:
                      validationPattern.alphabetsSpacesAndSpecialCharsPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.province &&
                  errors.province.type === 'required' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.province &&
                  errors.province.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.alphabetswithSpecialCharacter}
                    </Typography>
                  )}
              </Box>

              <Box width={'100%'}>
                <TextField
                  label="Post Code *"
                  type="text"
                  className="form-input"
                  {...register('postCode', {
                    required: true,
                    validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                    pattern: validationPattern.postCodePattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.postCode &&
                  errors.postCode.type === 'required' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.postCode &&
                  errors.postCode.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.onlyAlphabetsNumbers}
                    </Typography>
                  )}
              </Box>
            </Stack>
            <Stack
              display={'flex'}
              justifyContent={'flex-start'}
              direction={'row'}
              sx={{
                width: '100%',
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={'50%'}>
                <TextField
                  label="Country *"
                  type="text"
                  className="form-input"
                  {...register('country', {
                    required: true,
                    validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                    pattern: validationPattern.countryPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.country &&
                  errors.country.type === 'required' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.country &&
                  errors.country.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.countryPatternmessage}
                    </Typography>
                  )}
              </Box>
            </Stack>

            {/* Show access level info for logged user */}
            {/* {loggedUserAccess && (
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: '#F4F6F8',
                  border: '1px solid #E3F2FD',
                }}
              >
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Your Access Level
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Organization Type: {loggedUserOrgType} | User Type: {loggedUserType}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  You can add: {availableOrgTypes.length > 0 ? availableOrgTypes.join(', ') : 'None (view only)'}
                </Typography>
              </Box>
            )} */}

            <Typography
              variant="subtitle1"
              color="black"
              fontWeight={500}
              marginTop={3}
              marginBottom={2}
            >
              Feedflow Managers
            </Typography>
            {fields.map((item, index) => {
              const liveContact = watch(`contacts.${index}`);
              const isDisabled = !isContactComplete(liveContact);
              const organisationType = watch('organisationType');
              const availableUserTypes =
                organisationType
                  ? UserTypeByOrganisation[organisationType] || []
                  : [];
              const accessConfig = getUserAccessConfig(
                organisationType,
                liveContact?.userType,
              );

              return (
                <Stack
                  key={item.id}
                  display={'flex'}
                  direction={'row'}
                  sx={{
                    width: '100%',
                    marginBottom: 2,
                    gap: 1.5,
                    flexWrap: {
                      lg: 'nowrap',
                      xs: 'wrap',
                    },
                    justifyContent: {
                      md: 'center',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <TextField
                      label="Name *"
                      type="text"
                      className="form-input"
                      {...register(`contacts.${index}.name` as const, {
                        required: true,
                        validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                        pattern: validationPattern.alphabetsAndSpacesPattern,
                      })}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />

                    {errors &&
                      errors?.contacts &&
                      errors?.contacts[index] &&
                      errors?.contacts[index]?.name &&
                      errors?.contacts[index]?.name.type === 'required' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.required}
                        </Typography>
                      )}
                    {errors &&
                      errors?.contacts &&
                      errors?.contacts[index] &&
                      errors?.contacts[index]?.name &&
                      errors?.contacts[index]?.name.type === 'pattern' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.OnlyAlphabatsMessage}
                        </Typography>
                      )}
                  </Box>

                  <Box
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <FormControl className="form-input" fullWidth focused>
                      <InputLabel id={`user-type-select-label-${index}`}>
                        User Type *
                      </InputLabel>
                      <Controller
                        name={`contacts.${index}.userType`}
                        control={control}
                        rules={{
                          required: 'User type is required',
                        }}
                        render={({ field }) => (
                          <Select
                            labelId={`user-type-select-label-${index}`}
                            id={`user-type-select-${index}`}
                            label="User Type *"
                            value={field.value ?? ''}
                            onChange={(event) => {
                              field.onChange(event);
                              const selectedType = event.target.value as string;
                              const derivedAccess = getUserAccessConfig(
                                organisationType,
                                selectedType,
                              );
                              setValue(
                                `contacts.${index}.permission`,
                                selectedType,
                              );
                              setValue(
                                `contacts.${index}.permissions`,
                                derivedAccess?.modules ?? {},
                              );
                              setValue(
                                `contacts.${index}.userDefinition`,
                                derivedAccess?.definition ?? '',
                              );
                            }}
                            disabled={!organisationType}
                          >
                            {availableUserTypes.map((userType, i) => (
                              <MenuItem value={userType} key={i}>
                                {userType}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                    {!organisationType && (
                      <Typography variant="body2" color="orange" fontSize={13} mt={0.5}>
                        Please select organisation type first
                      </Typography>
                    )}
                    {errors &&
                      errors?.contacts &&
                      errors?.contacts[index] &&
                      errors?.contacts[index]?.userType &&
                      errors?.contacts[index]?.userType.type === 'required' && (
                        <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                          {validationMessage.required}
                        </Typography>
                      )}
                  </Box>
                  <input
                    type="hidden"
                    {...register(`contacts.${index}.permission` as const)}
                  />
                  <input
                    type="hidden"
                    {...register(`contacts.${index}.userDefinition` as const)}
                  />
                  {/* {accessConfig?.definition && (
                    <Box
                      sx={{
                        width: '100%',
                        mt: 1,
                        px: 1,
                        py: 0.75,
                        borderRadius: 1,
                        bgcolor: '#F9FBFC',
                        border: '1px solid #E3F2FD',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {accessConfig.definition}
                      </Typography>
                    </Box>
                  )}
                  {accessConfig && (
                    <Box
                      sx={{
                        width: '100%',
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                        sx={{ display: 'block', mb: 0.5 }}
                      >
                        Module access levels
                      </Typography>
                      <Grid container spacing={0.5}>
                        {MODULE_DISPLAY_ORDER.map((section) => {
                          if (section.children && section.children.length > 0) {
                            return section.children.map((child) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                key={`${section.key}-${child.key}`}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    bgcolor: '#F4F6F8',
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {section.label} — {child.label}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    fontWeight={600}
                                  >
                                    {resolveModuleAccess(
                                      accessConfig,
                                      section.key as keyof ModuleAccessMap,
                                      child.key,
                                    )}
                                  </Typography>
                                </Box>
                              </Grid>
                            ));
                          }

                          return (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              key={String(section.key)}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  bgcolor: '#F4F6F8',
                                  borderRadius: 1,
                                  px: 1,
                                  py: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {section.label}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  fontWeight={600}
                                >
                                  {resolveModuleAccess(
                                    accessConfig,
                                    section.key as keyof ModuleAccessMap,
                                  )}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  )} */}
                  <Box
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <TextField
                      label="Role *"
                      type="text"
                      className="form-input"
                      {...register(`contacts.${index}.role` as const, {
                        required: true,
                        validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                        pattern: validationPattern.addressPattern,
                      })}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />
                    {errors &&
                      errors?.contacts &&
                      errors?.contacts[index] &&
                      errors?.contacts[index]?.role &&
                      errors?.contacts[index]?.role.type === 'required' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.required}
                        </Typography>
                      )}
                  </Box>
                  <Box
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <TextField
                      label="Email *"
                      type="text"
                      className="form-input"
                      {...register(`contacts.${index}.email` as const, {
                        required: true,
                        pattern: validationPattern.emailPattern,
                        validate: (value) => {
                          const trimmedValue = String(value).trim();

                          // Reject if there are spaces anywhere in the email
                          if (/\s/.test(trimmedValue)) {
                            return 'Email should not contain spaces';
                          }

                          const isUnique = fields.every(
                            (f, i) =>
                              i === index ||
                              String(f.email).trim().toLowerCase() !== trimmedValue.toLowerCase()
                          );

                          if (!isUnique) {
                            return 'Please enter a unique email. This email is already used in contacts information';
                          }

                          return true;
                        },

                      })}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />
                    {errors &&
                      errors?.contacts &&
                      errors?.contacts[index] &&
                      errors?.contacts[index]?.email &&
                      errors?.contacts[index]?.email.type === 'required' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.required}
                        </Typography>
                      )}
                    {errors &&
                      errors?.contacts &&
                      errors?.contacts[index] &&
                      errors?.contacts[index]?.email &&
                      errors?.contacts[index]?.email.type === 'pattern' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.emailPatternMessage}
                        </Typography>
                      )}
                    {errors &&
                      errors?.contacts &&
                      errors?.contacts[index] &&
                      errors?.contacts[index]?.email &&
                      errors?.contacts[index]?.email.type === 'validate' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {errors?.contacts[index]?.email.message}
                        </Typography>
                      )}
                  </Box>

                  <Box
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <TextField
                      label="Phone *"
                      type="text"
                      className="form-input"
                      {...register(`contacts.${index}.phone` as const, {
                        required: true,
                        validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                        pattern: validationPattern.phonePattern,
                      })}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />
                    {errors &&
                      errors?.contacts &&
                      errors?.contacts[index] &&
                      errors?.contacts[index]?.phone &&
                      errors?.contacts[index]?.phone.type === 'required' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.required}
                        </Typography>
                      )}
                    {errors &&
                      errors?.contacts &&
                      errors?.contacts[index] &&
                      errors?.contacts[index]?.phone &&
                      errors?.contacts[index]?.phone.type === 'pattern' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.phonePatternMessage}
                        </Typography>
                      )}
                  </Box>
                  <Stack
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={'row'}
                    gap={'20px'}
                    minWidth={'67px'}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        cursor: !isDisabled ? 'pointer' : 'not-allowed',
                      }}
                      onClick={() => {
                        if (!isDisabled) {
                          handleInviteUser(index);
                        }
                      }}
                    >
                      <Image
                        title={liveContact.invite ? 'Invited' : 'Invite'}
                        width={20}
                        height={20}
                        src={liveContact.invite ? sentEmailIcon : sendEmailIcon}
                        alt="Send Email Icon"
                        style={{
                          opacity: !isDisabled ? 1 : 0.4,
                          cursor: !isDisabled ? 'pointer' : 'not-allowed',
                        }}
                      />
                    </Box>


                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{
                      visibility: index === 0 ? 'hidden' : '',
                      cursor: hasFullModuleAccess(accessConfig)
                        ? 'not-allowed'
                        : 'pointer',
                    }}
                    onClick={() => {
                      if (!hasFullModuleAccess(accessConfig)) {
                        remove(index);
                      }
                    }}
                  >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.4em"
                        height="1.4em"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none">
                          <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill={
                              hasFullModuleAccess(accessConfig)
                                ? '#808080'
                                : '#ff0000'
                            }
                            d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                          />
                        </g>
                      </svg>
                    </Box>
                  </Stack>
                </Stack>
              );
            })}
      
            <Stack
              p={1.5}
              direction={'row'}
              borderRadius={3}
              mt={2}
              color={'#06a19b'}
              fontSize={14}
              fontWeight={500}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              gap={0.5}
              border={'2px dashed #06a19b'}
              className="add-contact-btn"
              onClick={() => AddContactField()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.4em"
                height="1.4em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#06a19b"
                  d="M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 9h-4V7h-2v4H7v2h4v4h2v-4h4z"
                />
              </svg>
              Add Contact
            </Stack>
                       <Divider
              sx={{
                borderColor: '#979797',
                my: 1,
              }}
            />
            <Typography
              variant="subtitle1"
              color="black"
              fontWeight={500}
              marginTop={3}
              marginBottom={2}
            >
              Allocated advisers
            </Typography>

            {advisorFields.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                mb={2}
              >
                No advisers allocated yet.
              </Typography>
            )}

            {advisorFields.length === 0 && advisorContacts.length === 0 && (
              <Typography variant="body2" color="text.secondary" mb={2}>
                No advisor contacts added yet. Add advisor contacts in the Feedflow Managers section above.
              </Typography>
            )}

            {advisorFields.map((item, index) => {
              const assignment = watch(`allocatedAdvisors.${index}`);
              
              return (
                <Stack
                  key={item.id}
                  display={'flex'}
                  direction={'row'}
                  sx={{
                    width: '100%',
                    marginBottom: 2,
                    gap: 1.5,
                    flexWrap: {
                      lg: 'nowrap',
                      xs: 'wrap',
                    },
                    justifyContent: {
                      md: 'center',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <FormControl className="form-input" fullWidth focused>
                      <InputLabel id={`advisor-select-label-${index}`}>
                        Adviser *
                      </InputLabel>
                      <Controller
                        name={`allocatedAdvisors.${index}.advisorId`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            labelId={`advisor-select-label-${index}`}
                            id={`advisor-select-${index}`}
                            label="Adviser *"
                            value={field.value ?? ''}
                            onChange={(event) => {
                              const rawValue = event.target.value;
                              // Handle temporary IDs from contacts being added
                              const value = rawValue === '' ? null : rawValue;
                              handleAdvisorSelection(index, value, field.onChange);
                            }}
                            displayEmpty
                            disabled={advisorLoading || advisorContacts.length === 0}
                          >
                            <MenuItem value="">
                              <em>
                                {advisorLoading
                                  ? 'Loading advisers...'
                                  : advisorContacts.length === 0
                                    ? 'Add advisor contacts first'
                                    : 'Select adviser'}
                              </em>
                            </MenuItem>
                            {advisorOptions.map((advisor) => (
                              <MenuItem value={advisor.id} key={advisor.id}>
                                {advisor.name || advisor.email}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                    {errors?.allocatedAdvisors?.[index]?.advisorId && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <TextField
                      label="Email"
                      type="text"
                      className="form-input"
                      value={assignment?.advisorEmail ?? ''}
                      InputProps={{ readOnly: true }}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <FormControl className="form-input" fullWidth focused>
                      <InputLabel id={`advisor-access-select-label-${index}`}>
                        Access level *
                      </InputLabel>
                      <Controller
                        name={`allocatedAdvisors.${index}.accessLevel`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            labelId={`advisor-access-select-label-${index}`}
                            id={`advisor-access-select-${index}`}
                            label="Access level *"
                            value={field.value ?? ''}
                            onChange={(event) =>
                              field.onChange(Number(event.target.value))
                            }
                          >
                            {ADVISOR_ACCESS_OPTIONS.map((option) => (
                              <MenuItem value={option.value} key={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                    {errors?.allocatedAdvisors?.[index]?.accessLevel && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{
                      visibility: index === 0 ? 'hidden' : '',
                      cursor: 'pointer',
                    }}
                    onClick={() => removeAdvisor(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.4em"
                      height="1.4em"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                        <path
                          fill="#ff0000"
                          d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                        />
                      </g>
                    </svg>
                  </Box>
                </Stack>
              );
            })}

            {/* Removed Add adviser button - advisors are selected from contacts being added */}
            {advisorFields.length === 0 && advisorContacts.length > 0 && (
              <Button
                variant="outlined"
                onClick={() => {
                  appendAdvisor({
                    advisorId: null,
                    accessLevel: 3,
                    advisorEmail: '',
                    advisorName: '',
                  });
                }}
                sx={{
                  borderColor: '#06a19b',
                  color: '#06a19b',
                  mt: 2,
                }}
              >
                Add Adviser Selection
              </Button>
            )}

       

            <Button
              type="submit"
              disabled={isApiCallInProgress || (availableOrgTypes.length === 0 && loggedUserType !== 'SUPERADMIN')}
              variant="contained"
              sx={{
                background: (availableOrgTypes.length === 0 && loggedUserType !== 'SUPERADMIN') ? '#ccc' : '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                marginLeft: 'auto',
                display: 'block',
                marginTop: 2,
                '&:disabled': {
                  background: '#ccc',
                  color: '#666',
                },
              }}
            >
              {(availableOrgTypes.length === 0 && loggedUserType !== 'SUPERADMIN')
                ? 'No Permission to Add Organizations' 
                : 'Save New Organisation'}
            </Button>
          </form>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AddNewOrganisation;
