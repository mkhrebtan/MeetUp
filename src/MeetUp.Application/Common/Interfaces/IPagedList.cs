namespace MeetUp.Application.Common.Interfaces;

public interface IPagedList<T>
{
    List<T> Items { get; }

    int Page { get; }

    int PageSize { get; }

    int TotalCount { get; }

    bool HasNextPage { get; }

    bool HasPreviousPage { get; }

    Task<IPagedList<T>> Create(IQueryable<T> query, int page, int pageSize);
}