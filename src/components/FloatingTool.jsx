import { useState } from 'react';
import { ActionIcon, Transition, Group } from '@mantine/core';
import { IconTool, IconEdit, IconCopy, IconBookmark } from '@tabler/icons-react';
import './FloatingTool.css';

function FloatingActionButton(props) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="floating-action-button">
      {/* Main button */}
      <ActionIcon
        color="dark"
        onClick={() => setOpened(!opened)}
        className="action-icon"
      >
        <IconTool size="1.5rem" color="white" />
      </ActionIcon>

      {/* Floating actions */}
      <Transition 
        mounted={opened} 
        transition="slide-left"
        duration={200}
      >
        {(styles) => (
          <div
            style={{
              ...styles,
            }}
            className="floating-menu"
          >
            <ActionIcon 
            //   size="lg" 
            //   radius="xl" 
              variant="outline"
              className="menu-action-icon"
              onClick={() => {
                props?.setIsEditing(!props?.isEditing);
              }}
            >
              <IconEdit size="1.2rem" color="#000" />
            </ActionIcon>
            <ActionIcon 
              size="lg" 
              radius="xl" 
              variant="outline"
              className="menu-action-icon"
              onClick={() => {
                navigator.clipboard.writeText(props?.text || '');
              }}
            >
              <IconCopy size="1.2rem" color="#000" />
            </ActionIcon>
            <ActionIcon 
              size="lg" 
              radius="xl" 
              variant="outline"
              className="menu-action-icon"
            >
              <IconBookmark size="1.2rem" color="#000"/>
            </ActionIcon>
          </div>
        )}
      </Transition>
    </div>
  );
}

export default FloatingActionButton;