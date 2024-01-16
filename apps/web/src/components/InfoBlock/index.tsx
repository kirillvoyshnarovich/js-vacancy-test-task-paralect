import { FC, useMemo } from 'react';
import { Image, Text, Button, Stack } from '@mantine/core';
import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import classes from './InfoBlock.module.css';

interface InfoBlockProps {
  textHint: Array<string>;
  textTitle: string;
  textButton: string | null;
  imageUrl: string;
  buttonLink?: string;
  alignmentStyles?: Object,
}

const InfoBlock: FC<InfoBlockProps> = ({
  textHint,
  textTitle,
  textButton,
  imageUrl,
  buttonLink,
  alignmentStyles,
}) => {
  const hints = useMemo(
    () => textHint.map((line: string) => <Text ta="center" size="sm" c="#767676">{line}</Text>),
    [textHint],
  );

  return (
    <Stack
      className={classes.wrapperPage}
      style={alignmentStyles}
    >
      <Image
        src={imageUrl}
        alt="Product Image"
        style={{ margin: '0 auto', width: 'auto' }}
      />
      <Text fw="700" size="xl" ta="center" pt="10px" mb="2px" lh={1.6}>{textTitle}</Text>
      <div className={classes.hints}>
        { hints }
      </div>
      {
        textButton
          ? (
            <Link style={{ all: 'unset' }} href={buttonLink as Url}>
              <Button
                color="blue"
                fullWidth
                mt="ms"
                radius="md"
                classNames={{
                  label: classes.ckeckoutButtonLabel,
                  root: classes.ckeckoutButtonRoot,
                }}
              >
                {textButton}
              </Button>
            </Link>
          )
          : null
      }
    </Stack>
  );
};

export default InfoBlock;
