import React, { useState, useContext } from 'react';
import { AccountList,  FlippablePanel } from 'v2/components';
import {
  AddressBookContext,
  NetworkContext,
  NetworkUtils,
  SettingsContext,
  StoreContext
} from 'v2/services/Store';
import { NetworkId } from 'v2/types';
import { CustomNodeConfig } from 'v2/types/node';
import { DEFAULT_NETWORK, IS_ACTIVE_FEATURE } from 'v2/config';

import NetworkNodes from './components/NetworkNodes';
import AddOrEditNetworkNode from './components/AddOrEditNetworkNode';
import { AddressBookPanel, AddToAddressBook, GeneralSettings, DangerZone } from './components';
import MobileNavBar from 'v2/MobileNavBar';

function renderAccountPanel() {
  const { accounts } = useContext(StoreContext);
  return (
    <AccountList
      accounts={accounts}
      deletable={true}
      copyable={true}
      privacyCheckboxEnabled={IS_ACTIVE_FEATURE.PRIVATE_TAGS}
    />
  );
}

function renderAddressPanel() {
  const { createAddressBooks, addressBook, deleteAddressBooks, updateAddressBooks } = useContext(
    AddressBookContext
  );
  return (
    <FlippablePanel>
      {({ flipped, toggleFlipped }) =>
        flipped ? (
          <AddToAddressBook toggleFlipped={toggleFlipped} createAddressBooks={createAddressBooks} />
        ) : (
          <AddressBookPanel
            addressBook={addressBook}
            toggleFlipped={toggleFlipped}
            updateAddressBooks={updateAddressBooks}
            deleteAddressBooks={deleteAddressBooks}
          />
        )
      }
    </FlippablePanel>
  );
}

function renderNetworkNodes() {
  const {
    getNetworkByName,
    addNodeToNetwork,
    isNodeNameAvailable,
    getNetworkById,
    updateNode,
    deleteNode
  } = useContext(NetworkContext);
  const { addressBook } = useContext(AddressBookContext);
  const [networkId, setNetworkId] = useState<NetworkId>(DEFAULT_NETWORK);
  const [editNode, setEditNode] = useState<CustomNodeConfig | undefined>(undefined);

  const addressBookNetworks = NetworkUtils.getDistinctNetworks(addressBook, getNetworkByName);

  return (
    <FlippablePanel>
      {({ flipped, toggleFlipped }) =>
        flipped ? (
          <AddOrEditNetworkNode
            networkId={networkId}
            editNode={editNode}
            toggleFlipped={toggleFlipped}
            addNodeToNetwork={addNodeToNetwork}
            isNodeNameAvailable={isNodeNameAvailable}
            getNetworkById={getNetworkById}
            updateNode={updateNode}
            deleteNode={deleteNode}
          />
        ) : (
          <NetworkNodes
            networks={addressBookNetworks}
            toggleFlipped={(id, node) => {
              setNetworkId(id);
              setEditNode(node);

              toggleFlipped();
            }}
          />
        )
      }
    </FlippablePanel>
  );
}

function renderGeneralSettingsPanel() {
  const { updateSettings, settings } = useContext(SettingsContext);
  return (
    <>
      <GeneralSettings updateGlobalSettings={updateSettings} globalSettings={settings} />
      <DangerZone />
    </>
  );
}

interface TabOptions {
  [key: string]: React.ReactNode;
}

export default function Settings() {
  // In Mobile view we display a tab instead
  const [tab, setTab] = useState('accounts');
  const tabOptions: TabOptions = {
    ['accounts']: renderAccountPanel(),
    ['addresses']: renderAddressPanel(),
    ['general']: renderGeneralSettingsPanel(),
    ['nodes']: renderNetworkNodes()
  };
  const currentTab = tabOptions[tab];

  return (
    <>
      <MobileNavBar>
        <div
          className={`tab ${tab === 'accounts' ? 'active' : ''}`}
          onClick={() => setTab('accounts')}
        >
          <h6>Accounts</h6>
        </div>
        <div
          className={`tab ${tab === 'addresses' ? 'active' : ''}`}
          onClick={() => setTab('addresses')}
        >
          <h6>Addresses</h6>
        </div>
        <div className="w-100" />
        <div className={`tab ${tab === 'nodes' ? 'active' : ''}`} onClick={() => setTab('nodes')}>
          <h6>Network & Nodes</h6>
        </div>
        <div
          className={`tab ${tab === 'general' ? 'active' : ''}`}
          onClick={() => setTab('general')}
        >
          <h6>General</h6>
        </div>
      </MobileNavBar>
      <>{currentTab}</>
    </>
  );
}
