import NextLink from "next/link";
import { ChevronRightIcon } from "@heroicons/react/solid";

type IBreadcrumbPiece = {
  title: string;
  href: string;
};

type BreadcrumbProps = {
  pieces: IBreadcrumbPiece[];
};

export default function Breadcrumbs(props: BreadcrumbProps) {
  const pieces = props.pieces.map((piece, index) => {
    if (index === 0) {
      return (
        <NextLink href={piece.href} key={piece.title} passHref>
          <a className="text-sm font-medium text-gray-500 hover:text-gray-700">
            {piece.title}
          </a>
        </NextLink>
      );
    } else if (index < props.pieces.length - 1) {
      return (
        <div key={piece.title} className="flex">
          <ChevronRightIcon
            className="flex-shrink-0 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <NextLink href={piece.href} passHref>
            <a className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              {piece.title}
            </a>
          </NextLink>
        </div>
      );
    } else {
      return (
        <div key={piece.title} className="flex">
          <ChevronRightIcon
            className="flex-shrink-0 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
            {piece.title}
          </span>
        </div>
      );
    }
  });

  return (
    <div className="mb-5 pb-5 border-b border-gray-200">
      <h3 className="pb-3 text-lg leading-6 font-medium text-gray-900">
        {props.pieces[props.pieces.length - 1].title}
      </h3>

      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          {pieces}
        </ol>
      </nav>
    </div>
  );
}
