import Link, {LinkProps} from 'next/link';
import { useRouter } from 'next/router';

interface Props extends LinkProps {
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  matchExact?: boolean,
}

export default function LinkTo({
  children, href, as, replace, scroll,
  shallow, prefetch, locale, passHref,
  className = '', activeClassName, inactiveClassName,
  matchExact = false,
  ...anchorProps
}: React.PropsWithChildren<Props>) {
  const router = useRouter();

  const isActive = router.asPath === href || (!matchExact && router.pathname.startsWith(href.toString()));

  let newClassName = className;
  if (isActive && activeClassName) {
    newClassName += ` ${activeClassName}`;
  } else if (!isActive && inactiveClassName) {
    newClassName += ` ${inactiveClassName}`;
  }

  newClassName = newClassName.trim();

  return (
    <Link {...{
      href, as, replace, scroll, shallow, prefetch, locale, passHref,
    }}
    >
      {
        typeof children === 'function'
          ? children(isActive)
          : <a className={newClassName} {...anchorProps}>{children}</a>
      }
    </Link>
  );
}