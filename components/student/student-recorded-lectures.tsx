"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Award,
  BookOpen,
  ExternalLink,
  Loader2,
  MessageCircle,
  PlayCircle,
  RefreshCw,
  Search,
  Star,
  UserRound,
  X,
} from "lucide-react";

type Lecture = {
  id: string;
  program: string;
  subject: string;
  topic: string;
  title: string;
  description: string;
  recordingUrl: string;
  facultyName: string;
  averageRating: number;
  ratingCount: number;
  commentCount: number;
  myRating: number;
  recommendationScore: number;
  createdAt: string | null;
};

type Comment = {
  id: string;
  studentName: string;
  comment: string;
  isMine: boolean;
  createdAt: string | null;
};

function embedUrl(
  input: string,
): string | null {
  try {
    const url =
      new URL(input);

    const host =
      url.hostname
        .toLowerCase()
        .replace(
          /^www\./,
          "",
        );

    if (
      host ===
      "youtu.be"
    ) {
      const id =
        url.pathname
          .split("/")
          .filter(Boolean)[0];

      return id
        ? `https://www.youtube.com/embed/${id}`
        : null;
    }

    if (
      host ===
        "youtube.com" ||
      host ===
        "m.youtube.com"
    ) {
      if (
        url.pathname.startsWith(
          "/embed/",
        )
      ) {
        return input;
      }

      const id =
        url.searchParams.get(
          "v",
        );

      return id
        ? `https://www.youtube.com/embed/${id}`
        : null;
    }

    if (
      host ===
      "vimeo.com"
    ) {
      const id =
        url.pathname
          .split("/")
          .filter(Boolean)[0];

      return id
        ? `https://player.vimeo.com/video/${id}`
        : null;
    }

    if (
      host ===
        "drive.google.com" ||
      host ===
        "docs.google.com"
    ) {
      const match =
        url.pathname.match(
          /\/file\/d\/([^/]+)/,
        );

      const id =
        match?.[1] ||
        url.searchParams.get(
          "id",
        );

      return id
        ? `https://drive.google.com/file/d/${id}/preview`
        : null;
    }

    return null;
  } catch {
    return null;
  }
}

function dateLabel(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    undefined,
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    },
  );
}

export default function StudentRecordedLectures() {
  const [
    lectures,
    setLectures,
  ] =
    useState<Lecture[]>([]);

  const [
    subjects,
    setSubjects,
  ] =
    useState<string[]>([]);

  const [
    programs,
    setPrograms,
  ] =
    useState<string[]>([]);

  const [
    searchInput,
    setSearchInput,
  ] =
    useState("");

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    subject,
    setSubject,
  ] =
    useState("");

  const [
    sort,
    setSort,
  ] =
    useState(
      "recommended",
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    selected,
    setSelected,
  ] =
    useState<Lecture | null>(
      null,
    );

  const [
    comments,
    setComments,
  ] =
    useState<Comment[]>([]);

  const [
    commentsLoading,
    setCommentsLoading,
  ] =
    useState(false);

  const [
    commentText,
    setCommentText,
  ] =
    useState("");

  const [
    postingComment,
    setPostingComment,
  ] =
    useState(false);

  const [
    ratingSaving,
    setRatingSaving,
  ] =
    useState(false);

  const load =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError(
          "",
        );

        try {
          const params =
            new URLSearchParams();

          if (query) {
            params.set(
              "search",
              query,
            );
          }

          if (subject) {
            params.set(
              "subject",
              subject,
            );
          }

          params.set(
            "sort",
            sort,
          );

          const response =
            await fetch(
              `/api/student/recorded-lectures?${params.toString()}`,
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const data =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data.error ||
                "Unable to load recorded lectures.",
            );
          }

          setLectures(
            Array.isArray(
              data.lectures,
            )
              ? data.lectures
              : [],
          );

          setSubjects(
            Array.isArray(
              data.subjects,
            )
              ? data.subjects
              : [],
          );

          setPrograms(
            Array.isArray(
              data.programs,
            )
              ? data.programs
              : [],
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load recorded lectures.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [
        query,
        subject,
        sort,
      ],
    );

  useEffect(() => {
    void load();
  }, [load]);

  async function loadComments(
    lectureId:
      string,
  ) {
    setCommentsLoading(
      true,
    );

    try {
      const response =
        await fetch(
          `/api/student/recorded-lectures/${lectureId}/comments`,
          {
            credentials:
              "include",

            cache:
              "no-store",
          },
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Unable to load comments.",
        );
      }

      setComments(
        Array.isArray(
          data.comments,
        )
          ? data.comments
          : [],
      );
    } catch (
      loadError
    ) {
      setError(
        loadError instanceof
          Error
          ? loadError.message
          : "Unable to load comments.",
      );
    } finally {
      setCommentsLoading(
        false,
      );
    }
  }

  function openLecture(
    lecture:
      Lecture,
  ) {
    setSelected(
      lecture,
    );

    setComments(
      [],
    );

    setCommentText(
      "",
    );

    void loadComments(
      lecture.id,
    );
  }

  function searchLectures(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setQuery(
      searchInput.trim(),
    );
  }

  async function rateLecture(
    lecture:
      Lecture,
    rating:
      number,
  ) {
    if (
      ratingSaving
    ) {
      return;
    }

    setRatingSaving(
      true,
    );

    setError(
      "",
    );

    try {
      const response =
        await fetch(
          `/api/student/recorded-lectures/${lecture.id}/rating`,
          {
            method:
              "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                rating,
              }),
          },
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Unable to save rating.",
        );
      }

      const update =
        (
          item:
            Lecture,
        ): Lecture =>
          item.id ===
          lecture.id
            ? {
                ...item,

                myRating:
                  data.myRating,

                averageRating:
                  data.averageRating,

                ratingCount:
                  data.ratingCount,
              }
            : item;

      setLectures(
        (
          current,
        ) =>
          current.map(
            update,
          ),
      );

      setSelected(
        (
          current,
        ) =>
          current &&
          current.id ===
            lecture.id
            ? update(
                current,
              )
            : current,
      );
    } catch (
      ratingError
    ) {
      setError(
        ratingError instanceof
          Error
          ? ratingError.message
          : "Unable to save rating.",
      );
    } finally {
      setRatingSaving(
        false,
      );
    }
  }

  async function postComment(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !selected ||
      postingComment
    ) {
      return;
    }

    const text =
      commentText.trim();

    if (!text) {
      return;
    }

    setPostingComment(
      true,
    );

    setError(
      "",
    );

    try {
      const response =
        await fetch(
          `/api/student/recorded-lectures/${selected.id}/comments`,
          {
            method:
              "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                comment:
                  text,
              }),
          },
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Unable to post comment.",
        );
      }

      setCommentText(
        "",
      );

      setSelected(
        (
          current,
        ) =>
          current
            ? {
                ...current,

                commentCount:
                  data.commentCount,
              }
            : current,
      );

      setLectures(
        (
          current,
        ) =>
          current.map(
            (
              lecture,
            ) =>
              lecture.id ===
              selected.id
                ? {
                    ...lecture,

                    commentCount:
                      data.commentCount,
                  }
                : lecture,
          ),
      );

      await loadComments(
        selected.id,
      );
    } catch (
      commentError
    ) {
      setError(
        commentError instanceof
          Error
          ? commentError.message
          : "Unable to post comment.",
      );
    } finally {
      setPostingComment(
        false,
      );
    }
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Learning Library
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#281b1f]">
            Recorded Lectures
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Search your course subjects and topics and learn from the
            highest-rated faculty lectures.
          </p>

          {programs.length > 0 && (
            <p className="mt-2 text-[10px] font-bold text-[#8f0024]">
              Your course:{" "}
              {programs.join(
                " · ",
              )}
            </p>
          )}
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <form
            onSubmit={
              searchLectures
            }
            className="grid gap-3 lg:grid-cols-[1fr_220px_180px_auto]"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={
                  searchInput
                }
                onChange={(
                  event,
                ) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                placeholder="Search subject, topic, lecture or faculty..."
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-xs outline-none focus:border-[#8f0024]"
              />
            </div>

            <select
              value={
                subject
              }
              onChange={(
                event,
              ) =>
                setSubject(
                  event.target.value,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#8f0024]"
            >
              <option value="">
                All Subjects
              </option>

              {subjects.map(
                (
                  item,
                ) => (
                  <option
                    key={
                      item
                    }
                    value={
                      item
                    }
                  >
                    {item}
                  </option>
                ),
              )}
            </select>

            <select
              value={
                sort
              }
              onChange={(
                event,
              ) =>
                setSort(
                  event.target.value,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#8f0024]"
            >
              <option value="recommended">
                Recommended
              </option>

              <option value="highest">
                Highest Rated
              </option>

              <option value="newest">
                Newest
              </option>
            </select>

            <button
              type="submit"
              className="h-11 rounded-xl bg-[#8f0024] px-5 text-xs font-black text-white"
            >
              Search
            </button>
          </form>

          {(query ||
            subject) && (
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-[10px] font-bold text-slate-500">
                {lectures.length} matching lecture
                {lectures.length ===
                1
                  ? ""
                  : "s"}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchInput(
                    "",
                  );

                  setQuery(
                    "",
                  );

                  setSubject(
                    "",
                  );
                }}
                className="text-[10px] font-black text-[#8f0024]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#8f0024]" />

              <p className="mt-3 text-xs text-slate-400">
                Finding lectures...
              </p>
            </div>
          </div>
        ) : lectures.length ===
          0 ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 text-sm font-black text-slate-800">
              No recorded lectures found
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Try another subject or search term.
            </p>
          </section>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {lectures.map(
              (
                lecture,
                index,
              ) => (
                <article
                  key={
                    lecture.id
                  }
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {index ===
                    0 &&
                    sort ===
                      "recommended" &&
                    lecture.ratingCount >
                      0 && (
                      <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-black text-amber-700">
                        <Award className="h-3 w-3" />
                        Top Recommendation
                      </div>
                    )}

                  <div className="pr-28">
                    <p className="text-[9px] font-black uppercase tracking-wide text-[#8f0024]">
                      {lecture.subject}
                    </p>

                    <p className="mt-1 text-[10px] font-bold text-slate-400">
                      {lecture.topic}
                    </p>
                  </div>

                  <h2 className="mt-4 text-base font-black text-slate-900">
                    {lecture.title}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <UserRound className="h-3.5 w-3.5 text-[#8f0024]" />

                    {lecture.facultyName}
                  </div>

                  {lecture.description && (
                    <p className="mt-4 line-clamp-3 text-xs leading-6 text-slate-500">
                      {lecture.description}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      <Star
                        className="h-4 w-4 text-amber-500"
                        fill="currentColor"
                      />

                      <span className="text-xs font-black text-slate-800">
                        {lecture.averageRating.toFixed(
                          1,
                        )}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        ({lecture.ratingCount})
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <MessageCircle className="h-3.5 w-3.5" />

                      {lecture.commentCount}
                    </div>

                    {lecture.createdAt && (
                      <span className="text-[10px] text-slate-400">
                        {dateLabel(
                          lecture.createdAt,
                        )}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openLecture(
                        lecture,
                      )
                    }
                    className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#8f0024] text-xs font-black text-white"
                  >
                    <PlayCircle className="h-4 w-4" />

                    Watch Lecture
                  </button>
                </article>
              ),
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/65 p-3 sm:p-6">
          <div className="mx-auto my-4 max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wide text-[#8f0024]">
                  {selected.subject} · {selected.topic}
                </p>

                <h2 className="mt-2 text-lg font-black text-slate-900">
                  {selected.title}
                </h2>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  Faculty: {selected.facultyName}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(
                    null,
                  )
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-black">
              {embedUrl(
                selected.recordingUrl,
              ) ? (
                <iframe
                  src={
                    embedUrl(
                      selected.recordingUrl,
                    ) ||
                    undefined
                  }
                  title={
                    selected.title
                  }
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex aspect-video items-center justify-center p-8">
                  <a
                    href={
                      selected.recordingUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-xs font-black text-[#8f0024]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Recording
                  </a>
                </div>
              )}
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[1fr_360px]">
              <div>
                {selected.description && (
                  <p className="text-xs leading-6 text-slate-600">
                    {selected.description}
                  </p>
                )}

                <div className="mt-5 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-black text-slate-800">
                    Rate this lecture
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Your rating helps recommend the best lectures to other
                    students.
                  </p>

                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (
                        star,
                      ) => (
                        <button
                          key={
                            star
                          }
                          type="button"
                          disabled={
                            ratingSaving
                          }
                          onClick={() =>
                            void rateLecture(
                              selected,
                              star,
                            )
                          }
                          className="p-1 disabled:opacity-50"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={[
                              "h-6 w-6",

                              star <=
                              selected.myRating
                                ? "text-amber-500"
                                : "text-slate-300",
                            ].join(
                              " ",
                            )}
                            fill={
                              star <=
                              selected.myRating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      ),
                    )}

                    <span className="ml-2 text-xs font-bold text-slate-600">
                      {selected.averageRating.toFixed(
                        1,
                      )}{" "}
                      / 5 · {selected.ratingCount} ratings
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200">
                <div className="border-b border-slate-100 p-4">
                  <h3 className="text-xs font-black text-slate-800">
                    Student Comments
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {selected.commentCount} comments
                  </p>
                </div>

                <form
                  onSubmit={
                    postComment
                  }
                  className="border-b border-slate-100 p-4"
                >
                  <textarea
                    required
                    maxLength={
                      1000
                    }
                    value={
                      commentText
                    }
                    onChange={(
                      event,
                    ) =>
                      setCommentText(
                        event.target.value,
                      )
                    }
                    placeholder="Share your feedback about this lecture..."
                    className="min-h-[80px] w-full resize-none rounded-lg border border-slate-200 p-3 text-xs outline-none focus:border-[#8f0024]"
                  />

                  <button
                    type="submit"
                    disabled={
                      postingComment
                    }
                    className="mt-2 h-9 w-full rounded-lg bg-[#8f0024] text-[10px] font-black text-white disabled:opacity-50"
                  >
                    {postingComment
                      ? "Posting..."
                      : "Post Comment"}
                  </button>
                </form>

                <div className="max-h-[360px] overflow-y-auto">
                  {commentsLoading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-5 w-5 animate-spin text-[#8f0024]" />
                    </div>
                  ) : comments.length ===
                    0 ? (
                    <p className="p-6 text-center text-[10px] text-slate-400">
                      No comments yet. Be the first to comment.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {comments.map(
                        (
                          comment,
                        ) => (
                          <div
                            key={
                              comment.id
                            }
                            className="p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[10px] font-black text-slate-700">
                                {comment.studentName}
                                {comment.isMine
                                  ? " · You"
                                  : ""}
                              </p>

                              <span className="text-[9px] text-slate-400">
                                {dateLabel(
                                  comment.createdAt,
                                )}
                              </span>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-slate-600">
                              {comment.comment}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}